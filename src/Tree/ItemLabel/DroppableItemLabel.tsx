import styled from '@emotion/styled';
import React, { useContext, useRef, useState } from 'react';
import { DropTargetMonitor, XYCoord, useDrop } from 'react-dnd';
import TreeContext from '../TreeContext';
import { HoverState, Item } from '../types';

export interface DroppableItemLabelProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode;
    index: number;
    depth: number;
    itemId: number | string;
}

function getHoverState(ref: React.RefObject<HTMLDivElement>, monitor: DropTargetMonitor): HoverState {
    // Determine rectangle on screen
    const boundingRect = ref.current?.getBoundingClientRect();
    if (!boundingRect) {
        return 'none';
    }

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const clientY = (clientOffset as XYCoord).y - boundingRect.top;

    const topThreshold = boundingRect.height * 0.33;
    const bottomThreshold = boundingRect.height * 0.66;

    if (clientY < topThreshold) {
        return 'top';
    }

    if (clientY > bottomThreshold) {
        return 'bottom';
    }

    return 'middle';
}

const Wrapper = styled.div<{ hoverState: HoverState }>`
    background-color: ${({ hoverState }) => (hoverState === 'top' || hoverState === 'middle' ? 'grey' : 'initial')};
    ::after {
        position: absolute;
        pointer-events: none;
        bottom: 0;
        width: 100%;
        content: '';
        height: 3px;

        background-color: ${({ hoverState }) => (hoverState === 'bottom' ? 'blue' : '')};
    }
`;

const DroppableItemLabel = ({ children, index, depth, itemId, ...props }: DroppableItemLabelProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hoverState, setHoverState] = useState<HoverState>('none');
    const { moveItem } = useContext(TreeContext);

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'Folder',
            collect: (monitor) => {
                return {
                    isOver: monitor.isOver({ shallow: true }),
                };
            },
            drop: (item: Item, monitor) => {
                setHoverState('none');
                if (monitor.isOver({ shallow: true })) {
                    const sourceIndex = item.index;
                    const sourceDepth = item.depth;
                    const targetIndex = index;
                    const targetDepth = depth;
                    const targetId = itemId;
                    const isHorizontal = depth === item.depth;

                    if (sourceIndex === targetIndex && sourceDepth === targetDepth) {
                        return;
                    }

                    // Prevent moving to self
                    moveItem({ item, targetId, targetIndex, isHorizontal });
                }
            },
            hover(_, monitor) {
                if (monitor.isOver({ shallow: true })) {
                    setHoverState(getHoverState(ref, monitor));
                }
            },
        }),
        [itemId, index],
    );

    drop(ref);
    return (
        <Wrapper hoverState={isOver ? hoverState : 'none'} className='__kreme-folder-label' ref={ref} {...props}>
            {children}
        </Wrapper>
    );
};

export default DroppableItemLabel;
