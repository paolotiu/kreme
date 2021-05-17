export interface TreeDataType {
    type: 'folder' | 'file';
    name: string;
    children?: TreeDataType[];
    id: string | number;
}

export type TreeItemClickHandler = (id: string | number) => void;

export type AddFolder = (targetDepth: number, targetIndex: number, item: TreeDataType) => void;
export type RemoveFolderChild = (id: string | number, index: number) => void;

export interface Item extends TreeDataType {
    index: number;
    depth: number;
    parentId: string | number;
}

export type MoveItemFunc = (data: MoveItemFuncBaseParams | MoveItemFuncChangingDepthParams) => void;

export interface MoveItemFuncBaseParams {
    item: Item;
    targetId: string | number;
    targetIndex: number;
    isHorizontal?: boolean;
    isChangingDepth?: boolean;
}
export interface MoveItemFuncChangingDepthParams extends MoveItemFuncBaseParams {
    isChangingDepth: true;
    targetParentId: number | string;
}

export type HoverState = 'none' | 'bottom' | 'top' | 'middle';
