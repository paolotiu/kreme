import styled from '@emotion/styled';
import React, { HTMLProps } from 'react';
import { transitionDurationEase } from '../utils/transitionDurationEase';

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
    circle {
        fill: ${({ theme }) => theme.colors.lightest};
        transition: fill 0.2s ease-in;
    }
    z-index: 1;
    width: 100%;
    max-width: 100px;
`;

interface CircleProps {
    fill?: string;
}
const Circle = styled.circle<CircleProps>`
    fill: ${({ theme, fill }) => fill || theme.colors.lightest};
    transition: fill ${({ theme }) => transitionDurationEase(theme)};
`;
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
}

const Path = styled.path<PathProps>`
    fill: none;
    stroke-linecap: round;
    stroke: ${({ theme, stroke }) => stroke || theme.colors.primary};
    stroke-width: ${(props) => props.strokeWidth};
    stroke-dasharray: ${(props) => `${props.strokeDasharray}, 251.2`};
    stroke-linecap: ${(props) => props.strokeLinecap || 'round'};
    transition: stroke ${({ theme }) => transitionDurationEase(theme)},
        stroke-dasharray ${({ theme }) => transitionDurationEase(theme)};
`;

export function getProgressStrokeValue(num: number) {
    return ((num - 0) / (100 - 0)) * (251.2 - 0) + 0;
}

const CircleProgress = ({
    progressBarColor,
    completedBackgroundColor,
    completedProgressBarColor,
    label,
    progress,
    progressBarStyle = 'round',
    progressBarWidth = 3,
    backgroundColor,
    ...rest
}: Props) => (
    <Wrapper {...rest}>
        <svg id='svg' viewBox='0 0 100 100'>
            <Circle cx='50' cy='50' r='40' fill={progress === 100 ? backgroundColor : completedBackgroundColor} />
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
                stroke={progress === 100 ? completedProgressBarColor || progressBarColor : progressBarColor}
                strokeDasharray={getProgressStrokeValue(progress)}
                d='M50 10
            a 40 40 0 0 1 0 80
            a 40 40 0 0 1 0 -80'
            />
        </svg>
        <span>{label || progress + '%'}</span>
    </Wrapper>
);

export default CircleProgress;
