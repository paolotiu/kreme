import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Folder from './Folder';
import File from './File';
import { OnDropFunc, TreeDataType, TreeItemClickHandler } from './types';
import TreeContext, { TreeContextProvider } from './TreeContext';
import FolderWithDrag from './FolderWithDrag';

const StyledTree = styled.div<{ depth: number }>`
    --margin-left: 5px;
    --chevron-width: 20px;
    --item-padding-left: 20px;
    --label-padding-left: ${(props) => `calc(var(--padding-left) * ${props.depth} )`};
    width: 100%;
`;

export interface TreeProps {
    data?: TreeDataType[];
    noDropOnEmpty?: boolean;
    onFileClick?: TreeItemClickHandler;
    onFolderClick?: TreeItemClickHandler;
    onFolderActionClick?: (e: React.MouseEvent<HTMLButtonElement>, id: string | number) => void;
    depth?: number;
    className?: string;
    // ANy valid css unit
    spaceLeft?: string;
    draggable?: boolean;
    parentId?: string | number;
    path?: string;

    // DnD Props
    onFolderDrop?: OnDropFunc;
}

const Tree = ({
    data = [],
    noDropOnEmpty,
    onFolderClick,
    onFileClick,
    onFolderActionClick,
    depth = 0,
    className,
    spaceLeft,
    draggable,
    parentId = -1,
    path = '|',
}: TreeProps) => {
    const { moveItem } = useContext(TreeContext);

    return (
        <StyledTree data-testid='tree' depth={depth} className={className}>
            {data?.map((item, index) => {
                if (item.type === 'folder') {
                    return draggable ? (
                        <FolderWithDrag
                            isOpen={item.isOpen}
                            path={path}
                            draggable={false}
                            moveItem={moveItem}
                            parentId={parentId}
                            data={item.children}
                            spaceLeft={spaceLeft}
                            name={item.name}
                            key={item.id + item.type}
                            noDropOnEmpty={noDropOnEmpty}
                            onLabelClick={onFolderClick}
                            onActionClick={onFolderActionClick}
                            id={item.id}
                            depth={depth}
                            calledRecursively
                            index={index}
                        >
                            <Tree
                                path={path + '-' + item.id}
                                parentId={item.id}
                                key={item.id}
                                data={item.children}
                                depth={depth + 1}
                                noDropOnEmpty={noDropOnEmpty}
                                onFolderClick={onFolderClick}
                                draggable={draggable}
                            />
                            {!!item.children?.length && <div style={{ width: '100%', height: '4px' }} />}
                        </FolderWithDrag>
                    ) : (
                        <Folder
                            spaceLeft={spaceLeft}
                            name={item.name}
                            key={item.id + item.type}
                            noDropOnEmpty={noDropOnEmpty}
                            onLabelClick={onFolderClick}
                            onActionClick={onFolderActionClick}
                            id={item.id}
                            depth={depth}
                            calledRecursively
                        >
                            <Tree
                                data={item.children}
                                depth={depth + 1}
                                noDropOnEmpty={noDropOnEmpty}
                                onFolderClick={onFolderClick}
                            />
                        </Folder>
                    );
                }

                if (item.type === 'file') {
                    return (
                        <File
                            depth={depth}
                            key={item.id + item.type}
                            name={item.name}
                            onFileClick={onFileClick}
                            id={item.id}
                        />
                    );
                }

                return <> </>;
            })}
        </StyledTree>
    );
};

const TreeWrapper = ({ ...props }: TreeProps) => {
    const { data } = useContext(TreeContext);
    return (
        <DndProvider backend={HTML5Backend}>
            <Tree {...props} data={data} />
        </DndProvider>
    );
};

const TreeWithContextWrapper = ({ data, ...props }: TreeProps) => {
    return (
        <TreeContextProvider initialData={data || []} onDrop={props.onFolderDrop}>
            <TreeWrapper data={data} {...props} />
        </TreeContextProvider>
    );
};

export default Object.assign(TreeWithContextWrapper, { Folder, File });
