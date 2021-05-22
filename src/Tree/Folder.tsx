import styled from '@emotion/styled';
import { HiDotsHorizontal } from 'react-icons/hi';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { CSSProperties, useContext, useMemo } from 'react';
import Chevron from '../assets/filledChevron.svg';
import { svgToMotion } from '../utils/svgToMotion';
import { TreeItemClickHandler } from './types';
import ItemLabel from './ItemLabel/ItemLabel';
import TreeContext from './TreeContext';

const MotionChevron = styled(svgToMotion(Chevron))`
    fill: var(--chevron-color);
`;

const HandleContainer = styled.button`
    height: var(--chevron-width);
    width: var(--chevron-width);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.spacing.borderRadius.tiny + 'px'};
    border: none;
    background-color: transparent;
    :hover {
        background-color: var(--hover-bg);
    }
`;
const ChevronContainer = styled(HandleContainer)``;

const ActionContainer = styled(HandleContainer)`
    display: none;
`;

const Children = styled(motion.div)`
    overflow: hidden;
`;

const StyledFolder = styled.div<{ depth: number; spaceLeft?: string }>`
    width: 100%;
    --margin-left: 5px;
    --chevron-width: 20px;
    --item-padding-left: 20px;
    --chevron-color: ${({ theme }) => theme.colors.dark};
    --hover-bg: rgba(55, 53, 47, 0.08);
    // Variable to change whenever no chevron is requested
    --padding-left: var(--item-padding-left);

    cursor: pointer;
    .children {
        & .__kreme-folder-label {
            padding-left: ${(props) => `calc(var(--label-padding-left) + ${props.spaceLeft || '0px'})`};
        }
    }
    .__kreme-folder-label {
        padding: 0.25rem 0.3rem;
        padding-left: ${(props) => props.spaceLeft || 'initial'};
        display: flex;
        position: relative;
        align-items: center;
        justify-content: space-between;
        span {
            margin-left: var(--margin-left);
        }
        :hover {
            background-color: var(--hover-bg);
            .__kreme-folder-action-container {
                display: flex;
            }
        }

        .__kreme-folder-label-name {
            display: flex;
            align-items: center;
        }
    }
`;

export interface TreeFolderProps {
    name: string;
    isOpen?: boolean;
    id: string | number;
    noDropOnEmpty?: boolean;
    onLabelClick?: TreeItemClickHandler;
    children?: React.ReactNode;
    onActionClick?: (e: React.MouseEvent<HTMLButtonElement>, id: string | number) => void;
    withActionButton?: boolean;
    // 0 index
    depth?: number;
    calledRecursively?: boolean;
    spaceLeft?: string;
    onFolderOpen?: () => void;
    index?: number;
    style?: CSSProperties;
    draggable?: boolean;
}

export interface DraggableFolderProps extends TreeFolderProps {
    draggable: true;
    index: number;
    depth: number;
}

const variants: Variants = {
    hidden: {
        height: 0,
    },
    shown: {
        height: 'auto',
        transition: {
            ease: 'easeIn',
        },
    },
};
const Folder = React.forwardRef<HTMLDivElement, TreeFolderProps | DraggableFolderProps>(
    (
        {
            name,
            children,
            isOpen = false,
            noDropOnEmpty = false,
            onLabelClick,
            id,
            onActionClick,
            withActionButton = true,
            depth = 0,
            calledRecursively = false,
            spaceLeft,
            onFolderOpen,
            style,
            draggable,
            index,
        },
        ref,
    ) => {
        const { toggleItemOpen } = useContext(TreeContext);

        const childrenHasData = useMemo(() => {
            let hasData = false;
            React.Children.forEach(children, (child, i) => {
                if (React.isValidElement(child) && i === 0) {
                    hasData = !!child.props.data?.length;
                }
            });

            return hasData;
        }, [children]);
        const hasChevron = !noDropOnEmpty || (calledRecursively ? childrenHasData : !!children);
        const handleChevronClick = (e: React.MouseEvent | React.KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItemOpen(id);
            if (onFolderOpen) {
                onFolderOpen();
            }
        };

        const handleLabelClick = (e: React.MouseEvent | React.KeyboardEvent) => {
            if (onLabelClick) {
                onLabelClick(id);
            } else {
                handleChevronClick(e);
            }
        };

        return (
            <StyledFolder ref={ref} depth={depth} spaceLeft={spaceLeft} style={style} key={id}>
                <ItemLabel
                    depth={depth}
                    draggable={draggable}
                    index={index || -1}
                    itemId={id}
                    role='button'
                    tabIndex={0}
                    className='__kreme-folder-label'
                    onClick={handleLabelClick}
                    onKeyPress={handleLabelClick}
                >
                    <div className='__kreme-folder-label-name'>
                        <ChevronContainer
                            role='button'
                            tabIndex={0}
                            style={{ visibility: hasChevron ? 'initial' : 'hidden' }}
                            onClick={handleChevronClick}
                            onKeyPress={handleChevronClick}
                        >
                            <MotionChevron
                                // Added style to work around a bug https://github.com/framer/motion/issues/255#issuecomment-628397719
                                style={{ originX: '50%', originY: '50%', ['--chevron-color' as any]: '' }}
                                width='10px'
                                initial={false}
                                animate={isOpen ? { rotate: 180 } : { rotate: 90 }}
                            />
                        </ChevronContainer>
                        <span>{name}</span>
                    </div>
                    {withActionButton && (
                        <ActionContainer
                            className='__kreme-folder-action-container'
                            as='button'
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onActionClick) {
                                    onActionClick(e, id);
                                }
                            }}
                        >
                            <HiDotsHorizontal size='1em' style={{ color: 'var(--chevron-color)' }} />
                        </ActionContainer>
                    )}
                </ItemLabel>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <Children
                            initial='hidden'
                            animate={isOpen ? 'shown' : 'hidden'}
                            variants={variants}
                            exit='hidden'
                            className='children'
                        >
                            {children}
                        </Children>
                    )}
                </AnimatePresence>
            </StyledFolder>
        );
    },
);

export default Folder;
