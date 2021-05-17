import React from 'react';
import DroppableItemLabel, { DroppableItemLabelProps } from './DroppableItemLabel';

interface ItemLabelProps extends DroppableItemLabelProps {
    draggable?: boolean;
}

const ItemLabel = ({ draggable, children, itemId, depth, index, ...props }: ItemLabelProps) => {
    return (
        <>
            {draggable ? (
                <DroppableItemLabel itemId={itemId} depth={depth} index={index} {...props}>
                    {children}
                </DroppableItemLabel>
            ) : (
                <div className='__kreme-folder-label' {...props}>
                    {children}
                </div>
            )}
        </>
    );
};

export default ItemLabel;
