import React from 'react';
import { Divider, Props } from './Divider';
import { Meta } from '@storybook/react';

export default {
    title: 'Example/Divider',
    component: Divider,
    argTypes: {
        backgroundColor: { control: 'color' },
        textColor: { control: 'color' },
        lineColor: { control: 'color' },
        lineThickness: { control: 'text' },
        lineStyle: {
            control: {
                type: 'select',
                options: [
                    'dotted',
                    'dashed',
                    'solid',
                    'double',
                    'groove',
                    'ridge',
                    'inset',
                    'outset',
                    'none',
                    'hidden',
                ],
                default: 'solid',
            },
        },
    },
    args: {
        text: 'Hello World',
        lineStyle: 'solid',
    },
} as Meta;

export const Default = (args: Props) => <Divider {...args} />;
