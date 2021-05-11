export interface TreeDataType {
    type: 'folder' | 'file';
    name: string;
    children?: TreeDataType[];
    id: string | number;
}

export type TreeItemClickHandler = (id: string | number) => void;
