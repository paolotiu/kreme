import styled from '@emotion/styled';
import React from 'react';

const StyledItem = styled.div`
    padding-left: calc(var(--item-padding-left) + var(--chevron-width));
    .__kreme-file-label {
        padding: 0.2em 0.3em;
        display: flex;
        align-items: center;
        span {
            margin-left: var(--margin-left);
        }

        :hover {
            background-color: rgba(55, 53, 47, 0.08);
        }
    }
`;

interface Props {
    onFileClick?: (id: string | number) => void;
    id: string | number;
    name: string;
}

const File = ({ onFileClick, name, id }: Props) => {
    const handleClick = (e: React.KeyboardEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onFileClick) {
            onFileClick(id);
        }
    };
    return (
        <StyledItem role='button' tabIndex={0} onClick={handleClick} onKeyPress={handleClick}>
            <div className='__kreme-file-label'>
                <span>{name}</span>
            </div>
        </StyledItem>
    );
};

export default File;
