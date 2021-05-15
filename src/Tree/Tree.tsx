import styled from '@emotion/styled';
import React from 'react';
import Folder from './Folder';
import File from './File';
import { TreeDataType, TreeItemClickHandler } from './types';

const StyledTree = styled.div`
    --margin-left: 5px;
    --chevron-width: 20px;
    --item-padding-left: 20px;
`;

export interface TreeProps {
    data?: TreeDataType[];
    noDropOnEmpty?: boolean;
    onFileClick?: TreeItemClickHandler;
    onFolderClick?: TreeItemClickHandler;
    onFolderActionClick?: (e: React.MouseEvent<HTMLButtonElement>, id: string | number) => void;
    depth?: number;
}

const Tree = ({ data, noDropOnEmpty, onFolderClick, onFileClick, onFolderActionClick, depth = 0 }: TreeProps) => (
    <StyledTree data-testid='tree'>
        {data?.map((item) => {
            if (item.type === 'folder') {
                return (
                    <Folder
                        name={item.name}
                        key={item.id + item.type}
                        noDropOnEmpty={noDropOnEmpty}
                        onLabelClick={onFolderClick}
                        onActionClick={onFolderActionClick}
                        id={item.id}
                        depth={depth}
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

export default Object.assign(Tree, { Folder, File });
