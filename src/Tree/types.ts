export type TreeItemID = number | string;
export interface TreeDataType {
    type: 'folder' | 'file';
    name: string;
    children?: TreeDataType[];
    id: TreeItemID;
    isOpen?: boolean;
}

export type TreeItemClickHandler = (id: TreeItemID) => void;

export type AddFolder = (targetDepth: number, targetIndex: number, item: TreeDataType) => void;
export type RemoveFolderChild = (id: TreeItemID, index: number) => void;

export interface Item extends TreeDataType {
    index: number;
    depth: number;
    parentId: TreeItemID;
}

export type MoveItemFunc = (data: MoveItemFuncBaseParams | MoveItemFuncChangingDepthParams) => void;
export type ToggleItemOpenFunc = (id: TreeItemID) => void;

export interface MoveItemFuncBaseParams {
    item: Item;
    targetId: TreeItemID;
    targetIndex: number;
    isHorizontal?: boolean;
    isChangingDepth?: boolean;
}
export interface MoveItemFuncChangingDepthParams extends MoveItemFuncBaseParams {
    isChangingDepth: true;
    targetParentId: TreeItemID;
}

export type HoverState = 'none' | 'bottom' | 'top' | 'middle';

export type OnDropFunc = (data: {
    sourceId: TreeItemID;
    sourceIndex: number;
    targetId: TreeItemID;
    targetIndex: number;
    targetParent: TreeDataType;
    sourceParent: TreeDataType;
}) => void;

// Credits: Spodera
// https://github.com/microsoft/TypeScript/issues/20965#issuecomment-719976439
export type ValuesOf<T extends readonly any[]> = T[number];
