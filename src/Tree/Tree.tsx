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

export interface Props {
    data?: TreeDataType[];
    noDropOnEmpty?: boolean;
    onFileClick?: TreeItemClickHandler;
    onFolderClick?: TreeItemClickHandler;
}

const Tree = ({ data, noDropOnEmpty, onFolderClick, onFileClick }: Props) => (
    <StyledTree data-testid='tree'>
        {data?.map((item) => {
            if (item.type === 'folder') {
                return (
                    <Folder
                        name={item.name}
                        key={item.id + item.type}
                        noDropOnEmpty={noDropOnEmpty}
                        onLabelClick={onFolderClick}
                        id={item.id}
                    >
                        <Tree data={item.children} noDropOnEmpty={noDropOnEmpty} onFolderClick={onFolderClick} />
                    </Folder>
                );
            }

            if (item.type === 'file') {
                return <File key={item.id + item.type} name={item.name} onFileClick={onFileClick} id={item.id} />;
            }

            return <> </>;
        })}
    </StyledTree>
);

export default Tree;