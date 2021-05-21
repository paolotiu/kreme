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
    const bottomThreshold = boundingRect.height * 0.6;

    if (clientY < topThreshold) {
        return 'top';
    }

    if (clientY > bottomThreshold) {
        return 'bottom';
    }

    return 'middle';
}

const Wrapper = styled.div<{ hovering?: boolean; hoverColor?: string }>`
    position: relative;
    transition: all 0.3s ease-in;
    background-color: ${({ hovering, hoverColor }) => (hovering ? hoverColor || '#00000040' : 'initial')};
`;

const HoverBar = styled.div<{ left: string; spaceLeft?: string; barColor?: string; depth: number }>`
    position: absolute;
    width: 100%;
    height: 3px;
    --calculated-space-left: ${({ depth, spaceLeft }) => `calc(${depth} * ${spaceLeft || 'var(--item-padding-left)'})`};
    background-color: ${(props) => props.barColor || '#9e5ceb40'};
    left: ${(props) => `calc(${props.left} + var(--calculated-space-left) )`};
    overflow: hidden;
    pointer-events: none;
`;

// Dynamic array as keys solution from
// https://github.com/microsoft/TypeScript/issues/20965#issuecomment-370114910
export interface DNDProps<T extends string, U = { [K in T]: (item: any, treeItem: TreeDataType) => void }> {
    hoverColor?: string;
    hoverBarColor?: string;
    acceptedDropTypes?: readonly T[];
    onDrop?: U;
}

interface TreeFolderWithDragProps extends TreeFolderProps {
    index: number;
    depth: number;
    data?: TreeDataType[];
    parentId: string | number;
    moveItem: MoveItemFunc;
    path: string;
}

export const FolderWithDrag = function FolderWithDrag<DropTypes extends string>({
    data = [],
    parentId,
    hoverColor,
    moveItem,
    path,
    hoverBarColor,
    acceptedDropTypes,
    onDrop,
    ...props
}: TreeFolderWithDragProps & DNDProps<DropTypes>) {
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
                isOpen: props.isOpen,
                parentId,
            }),
        }),
        [props.id, props.index, props.depth, props.name, data, parentId, props.isOpen],
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

    const [{ isOver, isNotFolder }, drop] = useDrop(
        () => ({
            accept: ['Folder'].concat(acceptedDropTypes || []),
            collect: (monitor) => {
                return {
                    isOver: monitor.isOver({ shallow: true }),
                    isNotFolder: monitor.getItemType() !== 'Folder',
                };
            },
            drop: (item: Item, monitor) => {
                setHoverState('none');
                if (monitor.isOver({ shallow: true })) {
                    const type = monitor.getItemType() as DropTypes;

                    // User drop type
                    if (onDrop && type && onDrop[type] && type !== 'Folder') {
                        onDrop[type](item, { id: props.id, name: props.name, type: 'folder', isOpen: props.isOpen });
                        return;
                    }

                    const sourceIndex = item.index;
                    const sourceDepth = item.depth;
                    const targetIndex = props.index;
                    const targetDepth = props.depth;
                    const targetId = props.id;
                    const isHorizontal = props.depth === item.depth && parentId === item.parentId;
                    const isChangingParent = parentId !== item.parentId;
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
                                isChangingDepth: true,
                                targetParentId: parentId,
                            });
                            return;
                        }
                        if (isChangingParent) {
                            moveItem({
                                item,
                                targetId,
                                targetIndex,
                                isHorizontal,
                                isChangingDepth: true,
                                targetParentId: parentId,
                            });
                            return;
                        }
                        moveItem({ item, targetId, targetIndex, isHorizontal });
                        return;
                    }

                    // Changing depth top to bottom
                    if (isChangingDepth && dropPosition === 'bottom') {
                        moveItem({
                            item,
                            targetId,
                            targetIndex: targetIndex + 1,
                            isChangingDepth: true,
                            targetParentId: parentId,
                        });
                        return;
                    }

                    // Insert to folder
                    if (dropPosition === 'middle' || dropPosition === 'top') {
                        moveItem({ item, targetId, targetIndex, isHorizontal: false });
                        return;
                    }

                    // Top to bottom
                    if (item.index < props.index) {
                        if (isChangingParent) {
                            moveItem({
                                item,
                                targetId,
                                targetIndex: targetIndex + 1,
                                targetParentId: parentId,
                                isChangingDepth: true,
                            });
                            return;
                        }
                        moveItem({ item, targetId, targetIndex, isHorizontal });
                        return;
                    }

                    // Bottom to top
                    if (item.index > props.index) {
                        if (isChangingParent) {
                            moveItem({
                                item,
                                targetId,
                                targetIndex: targetIndex + 1,
                                targetParentId: parentId,
                                isChangingDepth: true,
                            });
                            return;
                        }
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
    const MemoizedHoverBar = useMemo(
        () => (
            <HoverBar
                left={hoverBarOffsetRef.current}
                spaceLeft={props.spaceLeft}
                barColor={hoverBarColor}
                depth={props.depth}
            />
        ),
        [hoverBarColor, props.depth, props.spaceLeft],
    );

    const shouldBeHovering =
        (isNotFolder && isOver) ||
        (isOver &&
            hoverState !== 'none' &&
            !(props.index === 0 && hoverState === 'top') &&
            (hoverState === 'middle' || hoverState === 'top'));
    const shouldTopBarAppear = !isNotFolder && isOver && props.index === 0 && hoverState === 'top';
    const shouldBottomBarAppear = !isNotFolder && isOver && hoverState === 'bottom';

    return (
        <Wrapper
            hoverColor={hoverColor}
            hovering={shouldBeHovering}
            id={`__kreme-draggable-wrapper-${props.id}`}
            onMouseLeave={() => setHoverState('none')}
        >
            {shouldTopBarAppear && MemoizedHoverBar}
            <Folder {...props} ref={ref} />
            {shouldBottomBarAppear && MemoizedHoverBar}
        </Wrapper>
    );
};

export default FolderWithDrag;
