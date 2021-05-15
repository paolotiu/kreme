import styled from '@emotion/styled';
import React from 'react';

const StyledItem = styled.div<{ depth: number }>`
    cursor: pointer;
    .__kreme-file-label {
        padding: 0.2em 0.3em;

        .spacer {
            width: calc(var(--chevron-width));
        }
        display: flex;
        align-items: center;
        span {
            padding-left: ${(props) => `calc(var(--chevron-width) * ${props.depth})`};
        }
        :hover {
            background-color: rgba(55, 53, 47, 0.08);
        }
    }
`;

export interface TreeFileProps {
    onFileClick?: (id: string | number) => void;
    id: string | number;
    name: string;
    depth?: number;
}

const File = ({ onFileClick, name, id, depth = 0 }: TreeFileProps) => {
    const handleClick = (e: React.KeyboardEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onFileClick) {
            onFileClick(id);
        }
    };
    return (
        <StyledItem role='button' tabIndex={0} onClick={handleClick} onKeyPress={handleClick} depth={depth}>
            <div className='__kreme-file-label'>
                <div className='spacer' />
                <span>{name}</span>
            </div>
        </StyledItem>
    );
};

export default File;
