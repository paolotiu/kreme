/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { arrayMove } from '../utils/arrayMove';
import { MoveItemFunc, MoveItemFuncBaseParams, MoveItemFuncChangingDepthParams, TreeDataType } from './types';

const isChangingDepthParams = (
    params: MoveItemFuncBaseParams | MoveItemFuncChangingDepthParams,
): params is MoveItemFuncChangingDepthParams => {
    return !!params.isChangingDepth;
};

interface TreeContextValue {
    data: TreeDataType[];
    any?: any;
    moveItem: MoveItemFunc;
}
export const TreeContext = React.createContext<TreeContextValue>({} as TreeContextValue);

interface Props {
    children: React.ReactNode;
    initialData: TreeDataType[];
}

export const TreeContextProvider = ({ children, initialData }: Props) => {
    const [data, setData] = useState(initialData);

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
    };

    return <TreeContext.Provider value={{ data, moveItem }}>{children}</TreeContext.Provider>;
};

export default TreeContext;
