import styled from '@emotion/styled';
import React, { useMemo, useRef, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import Folder, { TreeFolderProps } from './Folder';
import { TreeDataType, MoveItemFunc, HoverState, Item } from './types';

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
    position: relative;
    background-color: ${({ hoverState }) => (hoverState === 'top' || hoverState === 'middle' ? 'grey' : 'initial')};
`;
interface TreeFolderWithDragProps extends TreeFolderProps {
    index: number;
    depth: number;
    data?: TreeDataType[];
    parentId: string | number;
    moveItem: MoveItemFunc;
    path: string;
}

export const FolderWithDrag = ({ data = [], parentId, moveItem, path, ...props }: TreeFolderWithDragProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [hoverState, setHoverState] = useState<HoverState>('none');
    const [, drag] = useDrag(
        () => ({
            type: 'Folder',
            item: () => ({
                index: props.index,
                depth: props.depth,
                id: props.id,
                name: props.name,
                type: 'folder',
                children: data,
                parentId,
            }),
            collect: (monitor) => ({
                test: monitor.getDropResult(),
            }),
        }),
        [props.id, props.index, props.depth, props.name, data, parentId],
    );

    const pathArr = useMemo(() => path.split('-'), [path]);

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
                    const targetIndex = props.index;
                    const targetDepth = props.depth;
                    const targetId = props.id;
                    const isHorizontal = props.depth === item.depth && parentId === item.parentId;
                    const isChangingDepth = item.depth !== props.depth;
                    const dropPoistion = getHoverState(ref, monitor);

                    // Prevent moving to child
                    if (pathArr.includes(String(item.id))) {
                        return;
                    }
                    // Prevent moving to self
                    if (sourceIndex === targetIndex && sourceDepth === targetDepth && parentId === item.parentId) {
                        return;
                    }

                    // Prevent moving to same parent
                    if (props.id === item.parentId && (dropPoistion === 'top' || dropPoistion === 'middle')) {
                        return;
                    }

                    // Prevent moving to the same place
                    if (props.index === 0 && dropPoistion === 'bottom' && item.index === 1 && !isChangingDepth) {
                        return;
                    }

                    // Changing depth
                    if (isChangingDepth && dropPoistion === 'bottom') {
                        moveItem({ item, targetId, targetIndex, isChangingDepth: true, targetParentId: parentId });
                        return;
                    }

                    // Insert to folder
                    if (dropPoistion === 'middle' || dropPoistion === 'top') {
                        moveItem({ item, targetId, targetIndex, isHorizontal: false });
                        return;
                    }

                    // Top to bottom
                    if (item.index < props.index) {
                        moveItem({ item, targetId, targetIndex, isHorizontal });
                        return;
                    }

                    // Bottom to top
                    if (item.index > props.index) {
                        moveItem({ item, targetId, targetIndex: targetIndex + 1, isHorizontal });
                        return;
                    }

                    moveItem({ item, targetId, targetIndex, isHorizontal });
                }
            },
            hover(item, monitor) {
                if (monitor.isOver({ shallow: true })) {
                    if (item.id === props.id || pathArr.includes(String(item.id))) {
                        return;
                    }
                    setHoverState(getHoverState(ref, monitor));
                }
            },
        }),
        [props.id, props.index, props.depth],
    );

    drag(drop(ref));

    return (
        <Wrapper hoverState={isOver ? hoverState : 'none'}>
            <Folder {...props} ref={ref} />
            {isOver && hoverState === 'bottom' && (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '3px',
                        backgroundColor: 'blue',
                        overflow: 'hidden',
                    }}
                />
            )}
        </Wrapper>
    );
};

export default FolderWithDrag;
