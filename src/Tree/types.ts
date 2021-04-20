export interface TreeDataType {
    type: string;
    name: string;
    children?: TreeDataType[];
    id: string | number;
}

export type TreeItemClickHandler = (id: string | number) => void;
