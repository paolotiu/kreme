import React from 'react';
import { Story, Meta } from '@storybook/react';
import CircleProgress, { Props } from './CircleProgress';

const meta: Meta = {
    title: 'CircleProgress',
    component: CircleProgress,
    argTypes: {
        progress: {
            control: {
                type: 'range',
                options: {
                    min: 0,
                    max: 100,
                },
            },
        },
        progressBarColor: {
            control: 'color',
            table: {
                category: 'color',
            },
        },
        backgroundColor: {
            control: 'color',
            table: {
                category: 'color',
            },
        },
        completedBackgroundColor: {
            control: 'color',
            table: {
                category: 'color',
            },
        },
        completedProgressBarColor: {
            control: 'color',
            table: {
                category: 'color',
            },
        },
    },
};
export default meta;

const Template: Story<Props> = (args) => <CircleProgress {...args} />;

export const Default: Story<Props> = Template.bind({});
Default.args = {
    progress: 100,
};

export const CustomLabel: Story<Props> = Template.bind({});
CustomLabel.args = {
    label: 'Upload',
    progress: 50,
};
