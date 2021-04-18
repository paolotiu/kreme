import React from 'react';
import { Story } from '@storybook/react';
import TestComponent, { Props } from './TestComponent';

export default {
    title: 'TestComponent',
    component: TestComponent,
};
const Template: Story<Props> = (args) => <TestComponent {...args} />;
export const Primary = Template.bind({});
Primary.args = {
    theme: 'hey',
};
export const Secondary = () => <TestComponent theme='secondary' />;
