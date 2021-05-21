import React from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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
        isOpen: true,
        children: [
            {
                id: 3,
                type: 'folder',
                name: 'Components',
                children: [
                    { type: 'folder', name: 'HEYO', id: 10 },
                    { type: 'folder', name: 'BRUH', id: 90 },
                ],
            },

            {
                type: 'folder',
                name: 'WHHW',
                id: 5,
            },
            {
                type: 'folder',
                name: 'ajskd',
                id: 23,
            },
            {
                type: 'folder',
                name: 'affa',
                id: 29,
            },
        ],
    },
    {
        type: 'folder',
        name: 'What',
        id: 1,
        children: [
            {
                type: 'folder',
                name: 'HEY',
                id: 13290,
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

export const WithDrag: Story<TreeProps> = Template.bind({});
WithDrag.args = {
    data: structure,
    draggable: true,
    noDropOnEmpty: false,

    onFolderDrop: action('onFolderDrop'),
};

export const WithSpaceLeft: Story<TreeProps> = Template.bind({});
WithSpaceLeft.args = {
    ...WithDrag.args,
    spaceLeft: '1rem',
};
export const IndividualFolder = () => <Tree.Folder id='1' name='Test' />;
