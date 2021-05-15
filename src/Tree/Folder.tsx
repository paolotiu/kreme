import styled from '@emotion/styled';
import { HiDotsHorizontal } from 'react-icons/hi';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Chevron from '../assets/filledChevron.svg';
import { svgToMotion } from '../utils/svgToMotion';
import { TreeItemClickHandler } from './types';

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

const StyledFolder = styled.div`
    --chevron-color: ${({ theme }) => theme.colors.dark};
    --hover-bg: rgba(55, 53, 47, 0.08);
    // Variable to change whenever no chevron is requested
    --padding-left: var(--item-padding-left);

    cursor: pointer;
    .children {
        padding-left: var(--padding-left);
    }
    .__kreme-folder-label {
        padding: 0.2rem 0.3rem;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: space-between;
        span {
            margin-left: var(--margin-left);
        }
        :hover {
            background-color: var(--hover-bg);
            ${ActionContainer} {
                display: flex;
            }
        }

        .__kreme-folder-label-name {
            display: flex;
        }
    }
`;

export interface TreeFolderProps {
    name: string;
    isShown?: boolean;
    id: string | number;
    noDropOnEmpty?: boolean;
    onLabelClick?: TreeItemClickHandler;
    children?: React.ReactNode;
    onActionClick?: (e: React.MouseEvent<HTMLButtonElement>, id: string | number) => void;
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
const Folder = ({
    name,
    children,
    isShown = false,
    noDropOnEmpty = false,
    onLabelClick,
    id,
    onActionClick,
}: TreeFolderProps) => {
    const [willShow, setWillShow] = useState(isShown);
    const [hasChildren, setHasChildren] = useState(false);
    const hasChevron = !noDropOnEmpty || hasChildren;
    useEffect(() => {
        if (noDropOnEmpty) {
            React.Children.forEach(children, (el) => {
                if (React.isValidElement(el)) {
                    if (el.props.data?.length) {
                        setHasChildren(true);
                    }
                }
            });
        }
    }, [children, noDropOnEmpty]);

    const handleChevronClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWillShow(!willShow);
    };

    const handleLabelClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        if (onLabelClick) {
            onLabelClick(id);
        } else {
            handleChevronClick(e);
        }
    };

    return (
        <StyledFolder
            // Adjust padding if no chevron
            style={{
                ['--padding-left' as any]: hasChevron ? '' : 'calc(var(--item-padding-left) + var(--chevron-width))',
            }}
        >
            <div
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
                        style={{ display: hasChevron ? '' : 'none' }}
                        onClick={handleChevronClick}
                        onKeyPress={handleChevronClick}
                    >
                        <MotionChevron
                            // Added style to work around a bug https://github.com/framer/motion/issues/255#issuecomment-628397719
                            style={{ originX: '50%', originY: '50%', ['--chevron-color' as any]: '' }}
                            width='10px'
                            initial={{ rotate: 90 }}
                            animate={willShow ? { rotate: 180 } : { rotate: 90 }}
                        />
                    </ChevronContainer>

                    <span>{name}</span>
                </div>
                <ActionContainer
                    as='button'
                    onClick={(e) => {
                        if (onActionClick) {
                            onActionClick(e, id);
                        }
                    }}
                >
                    <HiDotsHorizontal size='1em' style={{ color: 'var(--chevron-color)' }} />
                </ActionContainer>
            </div>
            <AnimatePresence>
                <Children
                    initial='hidden'
                    animate={willShow ? 'shown' : 'hidden'}
                    variants={variants}
                    exit='hidden'
                    className='children'
                >
                    {children}
                </Children>
            </AnimatePresence>
        </StyledFolder>
    );
};
export default Folder;
