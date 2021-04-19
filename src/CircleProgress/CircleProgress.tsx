import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import React, { HTMLProps } from 'react';
import t from '../shared/theme';

const Wrapper = styled.div`
    font-family: inherit;
    text-align: center;
    display: inline-block;
    position: relative;
    span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    z-index: 1;
    width: 100%;
    max-width: 100px;
`;

interface CircleProps {}
const Circle = styled(motion.circle)<CircleProps>``;
export interface Props extends Omit<HTMLProps<HTMLDivElement>, 'as'> {
    progress: number;
    backgroundColor?: string;
    completedBackgroundColor?: string;
    progressBarColor?: string;
    completedProgressBarColor?: string;

    progressBarWidth?: number;
    /**
   Defaults to progress percentage
  */
    label?: string;
    progressBarStyle?: 'round' | 'butt' | 'square';
}

interface PathProps {
    stroke?: string;
    strokeWidth: number;
    strokeDasharray: number;
    strokeLinecap: string;
}

const Path = styled(motion.path)<PathProps>`
    fill: none;
    stroke-linecap: round;
    /* stroke: ${({ theme, stroke }) => stroke || theme.colors.primary}; */
    stroke-width: ${(props) => props.strokeWidth};
    stroke-dasharray: ${(props) => `${props.strokeDasharray}, 251.2`};
    stroke-linecap: ${(props) => props.strokeLinecap || 'round'};
`;

export function getProgressStrokeValue(num: number) {
    return ((num - 0) / (100 - 0)) * (251.2 - 0) + 0;
}

const CircleProgress = ({
    progressBarColor = t.colors.primary,
    backgroundColor = t.colors.lightest,
    completedBackgroundColor,
    completedProgressBarColor,
    label,
    progress,
    progressBarStyle = 'round',
    progressBarWidth = 3,
    ...rest
}: Props) => {
    const isFinished = progress === 100;
    return (
        <Wrapper {...rest}>
            <svg id='svg' viewBox='0 0 100 100'>
                <Circle
                    cx='50'
                    cy='50'
                    r='40'
                    animate={{ fill: isFinished ? completedBackgroundColor : backgroundColor }}
                    initial={{ fill: backgroundColor }}
                />
                <path
                    stroke='gray'
                    opacity={0.2}
                    fill='none'
                    strokeWidth={progressBarWidth - 1}
                    d='M50 10
              a 40 40 0 0 1 0 80
              a 40 40 0 0 1 0 -80'
                />
                <Path
                    data-testid='progress'
                    strokeWidth={progressBarWidth}
                    strokeLinecap={progressBarStyle}
                    initial={{ stroke: progressBarColor }}
                    animate={{
                        stroke: isFinished ? completedProgressBarColor || progressBarColor : progressBarColor,
                    }}
                    strokeDasharray={getProgressStrokeValue(progress)}
                    d='M50 10
            a 40 40 0 0 1 0 80
            a 40 40 0 0 1 0 -80'
                />
            </svg>
            <span>{label || progress + '%'}</span>
        </Wrapper>
    );
};

export default CircleProgress;
