import { Meta, Story } from '@storybook/react';
import React from 'react';
import { TreeFolderProps } from './Folder';
import Tree from './Tree';

export default {
    title: 'TreeFolder',
    component: Tree.Folder,
    parameters: {
        actions: { argTypesRegex: '^on.*' },
    },
} as Meta;

const Template: Story<TreeFolderProps> = (args) => (
    <div style={{ maxWidth: '200px' }}>
        <Tree.Folder {...args} />
    </div>
);

export const Default: Story<TreeFolderProps> = Template.bind({});
Default.args = {
    id: 1,
    name: 'Test',
};

export const WithChildren: Story<TreeFolderProps> = (args) => (
    <div>
        <Tree.Folder id='1' name='parent' {...args}>
            <Tree.Folder id='2' name='child' noDropOnEmpty />
        </Tree.Folder>
    </div>
);
