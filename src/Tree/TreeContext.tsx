/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { arrayMove } from '../utils/arrayMove';
import {
    MoveItemFunc,
    MoveItemFuncBaseParams,
    MoveItemFuncChangingDepthParams,
    OnDropFunc,
    ToggleItemOpenFunc,
    TreeDataType,
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
}
export const TreeContext = React.createContext<TreeContextValue>({} as TreeContextValue);

interface TreeContextProps {
    children: React.ReactNode;
    initialData: TreeDataType[];
    onDrop?: OnDropFunc;
    openOnDrop?: boolean;
}

export const TreeContextProvider = ({ children, initialData, onDrop, openOnDrop = false }: TreeContextProps) => {
    const [data, setData] = useState(initialData);

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
    const moveItem: MoveItemFunc = (params) => {
        const { item: itemToInsert, targetIndex, isHorizontal } = params;
        let { targetId } = params;
        if (isHorizontal) {
            const updateData = (item: TreeDataType) => {
                // Base case
                if (itemToInsert.parentId === item.id) {
                    item.children = arrayMove(item.children || [], itemToInsert.index, targetIndex);
                    return item;
                }
                item.children = item.children?.map(updateData);

                return item;
            };

            if (itemToInsert.parentId === -1) {
                setData((prevData) => arrayMove(prevData, itemToInsert.index, targetIndex));
            } else {
                setData((prevData) => prevData.map(updateData));
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
                }
                return item;
            }

            // Update children
            item.children = item.children.map(updateItem);

            // Check if this item is the target
            if (item.id === targetId) {
                if (item.children) {
                    item.children.push(itemToInsert);
                } else {
                    item.children = [itemToInsert];
                }
                shouldOpenHandler(item);
                return item;
            }

            // Remove item from inital place
            if (itemToInsert.parentId === item.id) {
                item.children = item.children.filter((i) => i.id !== itemToInsert.id);
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

            return updatedData;
        });
        if (onDrop) {
            onDrop({ sourceId: itemToInsert.id, sourceIndex: itemToInsert.index, targetId, targetIndex });
        }
    };

    return <TreeContext.Provider value={{ data, moveItem, toggleItemOpen }}>{children}</TreeContext.Provider>;
};

export default TreeContext;
