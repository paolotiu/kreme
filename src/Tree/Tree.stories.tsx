import React from 'react';
import { Meta, Story } from '@storybook/react';
import Tree, { TreeProps } from './Tree';
import { TreeDataType } from './types';

export default {
    title: 'Tree',
    component: Tree,
    parameters: {
        actions: { argTypesRegex: '^on.*' },
    },
} as Meta;

const Template: Story<TreeProps> = (args) => (
    <div style={{ maxWidth: '200px' }}>
        <Tree {...args} />
    </div>
);

const structure: TreeDataType[] = [
    {
        id: 2,
        type: 'folder',
        name: 'src',
        children: [
            {
                id: 3,
                type: 'folder',
                name: 'Components',
                children: [
                    { type: 'folder', name: 'HEYO', id: 10 },
                    { type: 'file', name: 'BRUH', id: 90 },
                ],
            },
            {
                type: 'folder',
                name: 'What',
                id: 1,
            },
            {
                type: 'file',
                name: 'WHHW',
                id: 5,
            },
        ],
    },
];
export const Default: Story<TreeProps> = Template.bind({});
Default.args = {
    data: structure,
};

export const NoDropOnEmpty: Story<TreeProps> = Template.bind({});
NoDropOnEmpty.args = {
    data: structure,
    noDropOnEmpty: true,
};

export const IndividualFolder = () => <Tree.Folder id='1' name='Test' />;
