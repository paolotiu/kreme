import { useReducer } from 'react';
import { arrayMove } from '../utils/arrayMove';
import { TreeDataType } from './types';

type Action =
    | { type: 'add'; index: number; item: TreeDataType }
    | { type: 'move'; sourceIndex: number; targetIndex: number }
    | { type: 'remove'; index: number }
    | { type: 'changeChildren'; id: string | number; newChildren: TreeDataType[] };

export type TreeMoveDispatch = (sourceIndex: number, targetIndex: number) => void;
export type TreeRemoveDispatch = (index: number) => void;
export type TreeAddDispatch = (targetIndex: number, item: TreeDataType) => void;
type State = {
    data: TreeDataType[];
};
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'add':
            const dataCopy = [...state.data];
            dataCopy.splice(action.index, 0, action.item);
            return { data: dataCopy };
        case 'move':
            return { data: arrayMove(state.data, action.sourceIndex, action.targetIndex) };
        case 'remove':
            const removeDataCopy = [...state.data];
            removeDataCopy.splice(action.index, 1);
            return { data: removeDataCopy };
        case 'changeChildren':
            const changeChildrenDataCopy = [...state.data];
            const folder = changeChildrenDataCopy.find((item) => item.id === action.id);
            if (folder) {
                folder.children = action.newChildren;
            }
            return { data: changeChildrenDataCopy };
        default:
            return state;
    }
}

export const useTreeStateReducer = (initialData: TreeDataType[]) => {
    const [state, dispatch] = useReducer(reducer, { data: initialData });

    const add = (index: number, item: TreeDataType) => {
        dispatch({ type: 'add', index, item });
    };
    const move = (sourceIndex: number, targetIndex: number) => {
        dispatch({ type: 'move', sourceIndex, targetIndex });
    };
    const remove = (index: number) => {
        dispatch({ type: 'remove', index });
    };
    const changeChildren = (id: string | number, newChildren: TreeDataType[]) => {
        dispatch({ type: 'changeChildren', id, newChildren });
    };

    return { state, dispatch, add, move, remove, changeChildren };
};
