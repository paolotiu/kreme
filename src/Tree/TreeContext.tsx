/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { arrayMove } from '../utils/arrayMove';
import {
    MoveItemFunc,
    MoveItemFuncBaseParams,
    MoveItemFuncChangingDepthParams,
    OnDropFunc,
    ToggleItemOpenFunc,
    TreeDataType,
    UpdateStateFunc,
} from './types';

const isChangingDepthParams = (
    params: MoveItemFuncBaseParams | MoveItemFuncChangingDepthParams,
): params is MoveItemFuncChangingDepthParams => {
    return !!params.isChangingDepth;
};

interface TreeContextValue {
    data: TreeDataType[];
    any?: any;
    moveItem: MoveItemFunc;
    toggleItemOpen: ToggleItemOpenFunc;
    updateState: UpdateStateFunc;
}
export const TreeContext = React.createContext<TreeContextValue>({} as TreeContextValue);

interface TreeContextProps {
    children: React.ReactNode;
    initialData: TreeDataType[];
    onDrop?: OnDropFunc;
    openOnDrop?: boolean;
}

const rootToFolder = (data: TreeDataType[]): TreeDataType => ({ type: 'folder', id: -1, name: 'root', children: data });

export const TreeContextProvider = ({ children, initialData, onDrop, openOnDrop = false }: TreeContextProps) => {
    const [data, setData] = useState(initialData);
    const targetParentRef = useRef<TreeDataType>(rootToFolder(data));
    const sourceParentRef = useRef<TreeDataType>(rootToFolder(data));

    useEffect(() => {
        // Get updated data
        setData(initialData);
    }, [initialData]);

    const toggleItemOpen: ToggleItemOpenFunc = (id) => {
        const toggle = (item: TreeDataType) => {
            // Base case
            if (item.id === id) {
                item.isOpen = !item.isOpen;
                return item;
            }

            item.children?.map(toggle);
            return item;
        };

        setData((prevData) => {
            const dataCopy = cloneDeep(prevData);
            return dataCopy.map(toggle);
        });
    };

    const shouldOpenHandler = (item: TreeDataType) => {
        item.isOpen = openOnDrop ? true : item.isOpen;
    };

    const updateState: UpdateStateFunc = (id, state) => {
        const updateAndFind = (item: TreeDataType) => {
            // Base case
            if (item.id === id) {
                Object.assign(item, state);
                return item;
            }

            item.children = item.children?.map(updateAndFind);
            return item;
        };

        setData((prevData) => {
            const dataCopy = cloneDeep(prevData);
            return dataCopy.map(updateAndFind);
        });
    };

    const moveItem: MoveItemFunc = (params) => {
        const { item: itemToInsert, targetIndex, isHorizontal } = params;
        let { targetId } = params;
        let newTree: TreeDataType[] = data;

        if (isHorizontal) {
            const updateData = (item: TreeDataType) => {
                // Base case
                if (itemToInsert.parentId === item.id) {
                    item.children = arrayMove(item.children || [], itemToInsert.index, targetIndex);
                    sourceParentRef.current = item;
                    targetParentRef.current = item;
                    return item;
                }
                item.children = item.children?.map(updateData);

                return item;
            };

            if (itemToInsert.parentId === -1) {
                setData((prevData) => {
                    const updatedData = arrayMove(prevData, itemToInsert.index, targetIndex);
                    sourceParentRef.current = rootToFolder(updatedData);
                    targetParentRef.current = rootToFolder(updatedData);
                    newTree = updatedData;
                    return updatedData;
                });
            } else {
                setData((prevData) => {
                    const updatedData = prevData.map(updateData);
                    newTree = updatedData;
                    return updatedData;
                });
            }
            if (onDrop) {
                onDrop({
                    sourceId: itemToInsert.id,
                    sourceIndex: itemToInsert.index,
                    targetId,
                    targetIndex,
                    sourceParent: sourceParentRef.current,
                    targetParent: targetParentRef.current,
                    newTree,
                });
            }
            return;
        }

        if (isChangingDepthParams(params)) {
            targetId = params.targetParentId;
        }

        const updateItem = (item: TreeDataType) => {
            // Base case
            if (!item.children?.length) {
                if (item.id === targetId) {
                    shouldOpenHandler(item);
                    item.children = [itemToInsert];
                    targetParentRef.current = item;
                }
                return item;
            }

            // Update children
            item.children = item.children.map(updateItem);

            // Check if this item is the target
            if (item.id === targetId) {
                if (item.children) {
                    item.children.splice(targetIndex, 0, itemToInsert);
                } else {
                    item.children = [itemToInsert];
                }
                shouldOpenHandler(item);
                targetParentRef.current = item;
                return item;
            }

            // Remove item from inital place
            if (itemToInsert.parentId === item.id) {
                item.children = item.children.filter((i) => i.id !== itemToInsert.id);
                sourceParentRef.current = item;
            }

            return item;
        };

        setData((prevData) => {
            let dataCopy = cloneDeep(prevData);
            if (targetId === -1) {
                dataCopy.splice(targetIndex, 0, itemToInsert);
            }

            if (itemToInsert.parentId === -1) {
                dataCopy = dataCopy.filter((i) => i.id !== itemToInsert.id);
            }

            const updatedData = dataCopy.map(updateItem);

            if (targetId === -1) {
                targetParentRef.current = rootToFolder(updatedData);
            }

            if (itemToInsert.parentId === -1) {
                sourceParentRef.current = rootToFolder(updatedData);
            }
            newTree = updatedData;
            return updatedData;
        });

        if (onDrop) {
            onDrop({
                sourceId: itemToInsert.id,
                sourceIndex: itemToInsert.index,
                targetId,
                targetIndex,
                sourceParent: sourceParentRef.current,
                targetParent: targetParentRef.current,
                newTree,
            });
        }
    };

    return (
        <TreeContext.Provider value={{ data, moveItem, toggleItemOpen, updateState }}>{children}</TreeContext.Provider>
    );
};

export default TreeContext;
