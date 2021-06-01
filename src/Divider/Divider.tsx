import styled from '@emotion/styled';
import React from 'react';
import { CSSBorder } from '../types';

interface LineProps {
    lineColor: string;
    lineThickness: string;
    lineStyle: string;
}
const Line = styled.p<LineProps>`
    width: 100%;
    text-align: center;
    border-top: ${(props) => `${props.lineThickness} ${props.lineStyle} ${props.lineColor}`};
    line-height: 0;
    margin: 10px 0 20px;
`;
const Text = styled.span<{ backgroundColor: string; textColor: string }>`
    background: ${(props) => props.backgroundColor};
    color: ${(props) => props.textColor};
    padding: 0 10px;
`;

export interface Props {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    lineColor?: string;
    lineStyle?: CSSBorder;
    /** 
    Any valid css unit
  */
    lineThickness?: string;
}

export const Divider = ({
    text,
    backgroundColor = 'white',
    textColor = 'black',
    lineColor = 'black',
    lineThickness = '1px',
    lineStyle = 'solid',
}: Props) => {
    return (
        <div>
            <Line lineColor={lineColor} lineThickness={lineThickness} lineStyle={lineStyle}>
                <Text backgroundColor={backgroundColor} textColor={textColor}>
                    {text}
                </Text>
            </Line>
        </div>
    );
};
