import styled from '@emotion/styled';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    const bottomThreshold = boundingRect.height * 0.5;

    if (clientY < topThreshold) {
        return 'top';
    }

    if (clientY > bottomThreshold) {
        return 'bottom';
    }

    return 'middle';
}
const Wrapper = styled.div<{ hovering?: boolean }>`
    position: relative;
    transition: all 0.3s ease-in;
    background-color: ${({ hovering }) => (hovering ? '#00000018' : 'initial')};
`;

const HoverBar = styled.div<{ left: string }>`
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: #9e5ceb40;
    left: ${(props) => props.left};
    overflow: hidden;
    pointer-events: none;
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

    const hoverBarOffsetRef = useRef('0px');

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

    // Path array to compare to in the hover state
    const pathArr = useMemo(() => path.split('-'), [path]);

    useEffect(() => {
        if (ref.current) {
            const folderLabel = ref.current.firstElementChild;
            if (folderLabel) {
                const { paddingLeft } = window.getComputedStyle(folderLabel);
                hoverBarOffsetRef.current = paddingLeft;
            }
        }
    }, []);

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'Folder',
            collect: (monitor) => {
                return {
                    isOver: monitor.isOver({ shallow: true }),
                };
            },
            options: {
                dropEffect: '',
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
                    const dropPosition = getHoverState(ref, monitor);

                    // Prevent moving to child
                    if (pathArr.includes(String(item.id))) {
                        return;
                    }
                    // Prevent moving to self
                    if (sourceIndex === targetIndex && sourceDepth === targetDepth && parentId === item.parentId) {
                        return;
                    }

                    // Prevent moving to same parent
                    if (
                        props.id === item.parentId &&
                        ((dropPosition === 'top' && props.index !== 0) || dropPosition === 'middle')
                    ) {
                        return;
                    }

                    // Prevent moving to the same place
                    if (props.index === 0 && dropPosition === 'bottom' && item.index === 1 && !isChangingDepth) {
                        return;
                    }

                    // First child bottom to top
                    if (props.index === 0 && dropPosition === 'top') {
                        if (isChangingDepth) {
                            moveItem({
                                item,
                                targetId,
                                targetIndex,
                                isHorizontal,
                                isChangingDepth,
                                targetParentId: parentId,
                            });
                            return;
                        }

                        moveItem({ item, targetId, targetIndex, isHorizontal });
                        return;
                    }

                    // Changing depth
                    if (isChangingDepth && dropPosition === 'bottom') {
                        moveItem({ item, targetId, targetIndex, isChangingDepth: true, targetParentId: parentId });
                        return;
                    }

                    // Insert to folder
                    if (dropPosition === 'middle' || dropPosition === 'top') {
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
        <Wrapper
            hovering={isOver && hoverState !== 'none' && !(props.index === 0 && hoverState === 'top')}
            id={`__kreme-draggable-wrapper-${props.id}`}
            onMouseLeave={() => setHoverState('none')}
        >
            {isOver && props.index === 0 && hoverState === 'top' && <HoverBar left={hoverBarOffsetRef.current} />}
            <Folder {...props} ref={ref} />

            {isOver && hoverState === 'bottom' && <HoverBar left={hoverBarOffsetRef.current} />}
        </Wrapper>
    );
};

export default FolderWithDrag;
