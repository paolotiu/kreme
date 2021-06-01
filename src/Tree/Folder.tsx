import styled from '@emotion/styled';
import { HiDotsHorizontal } from 'react-icons/hi';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { CSSProperties, useContext, useEffect, useMemo, useRef } from 'react';
import Chevron from '../assets/filledChevron.svg';
import { svgToMotion } from '../utils/svgToMotion';
import { TreeItemClickHandler, TreeItemInputHandler, TreeItemToggleHandler } from './types';
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
        display: grid;
        position: relative;
        grid-template-columns: 90% 20px;
        align-items: center;
        span {
            margin-left: var(--margin-left);
        }

        .__kreme-folder-name {
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        :hover {
            background-color: var(--hover-bg);
            .__kreme-folder-action-container {
                display: flex;
            }
        }

        .__kreme-folder-name-input {
            width: 80%;
            position: relative;
            input {
                padding: 0;
                border: none;
                width: 100%;
                background-color: transparent;
                outline: none;
                :focus-visible {
                }
            }
            input[type='submit'] {
                width: 0;
                height: 0;
            }
            ::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: gray;
                position: absolute;
                bottom: -4px;
                left: 0;
            }
        }

        .__kreme-folder-label-name {
            display: flex;
            align-items: center;
            max-width: 100%;
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
    onToggle?: TreeItemToggleHandler;
    index?: number;
    style?: CSSProperties;
    draggable?: boolean;
    isInput?: boolean;
    onInputSubmit?: TreeItemInputHandler;
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
            style,
            draggable,
            index,
            isInput = false,
            onInputSubmit,
            onToggle,
        },
        ref,
    ) => {
        const { toggleItemOpen, updateState } = useContext(TreeContext);

        const inputRef = useRef<HTMLInputElement>(null);
        const childrenHasData = useMemo(() => {
            let hasData = false;
            React.Children.forEach(children, (child, i) => {
                if (React.isValidElement(child) && i === 0) {
                    hasData = !!child.props.data?.length;
                }
            });

            return hasData;
        }, [children]);

        useEffect(() => {
            const inputHandler = (e: Event) => {
                if (onInputSubmit) {
                    if ((e as KeyboardEvent).key === 'Enter' || e.type === 'mousedown') {
                        onInputSubmit({
                            id,
                            newName: inputRef.current?.value || name,
                            oldName: name,
                        });
                        updateState(id, { name: inputRef.current?.value, isInput: false });
                    }
                }
            };

            if (isInput) {
                window.addEventListener('mousedown', inputHandler);
                window.addEventListener('keydown', inputHandler);
            }
            return () => {
                window.removeEventListener('mousedown', inputHandler);
                window.removeEventListener('keydown', inputHandler);
            };
        }, [id, isInput, name, onInputSubmit, updateState]);
        useEffect(() => {
            if (isInput) {
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        }, [isInput]);

        const hasChevron = !noDropOnEmpty || (calledRecursively ? childrenHasData : !!children);
        const handleChevronClick = (e: React.MouseEvent | React.KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItemOpen(id);
            if (onToggle) {
                onToggle(id, !isOpen);
            }
        };

        const handleLabelClick = (e: React.MouseEvent | React.KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();
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
                    // onKeyPress={handleLabelClick}
                >
                    <div className='__kreme-folder-label-name'>
                        <ChevronContainer
                            role='button'
                            tabIndex={0}
                            style={{ visibility: hasChevron ? 'initial' : 'hidden' }}
                            onClick={handleChevronClick}
                            // onKeyPress={handleChevronClick}
                        >
                            <MotionChevron
                                // Added style to work around a bug https://github.com/framer/motion/issues/255#issuecomment-628397719
                                style={{ originX: '50%', originY: '50%', ['--chevron-color' as any]: '' }}
                                width='10px'
                                initial={false}
                                animate={isOpen ? { rotate: 180 } : { rotate: 90 }}
                            />
                        </ChevronContainer>
                        {isInput ? (
                            <span className='__kreme-folder-name-input'>
                                <input
                                    ref={inputRef}
                                    type='text'
                                    name='folderName'
                                    defaultValue={name}
                                    onMouseDown={(e) => {
                                        // Prevent window bubbling
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        // Prevent label click
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    autoComplete='off'
                                />
                            </span>
                        ) : (
                            <span className='__kreme-folder-name'>{name}</span>
                        )}
                    </div>
                    {withActionButton && !isInput && (
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
