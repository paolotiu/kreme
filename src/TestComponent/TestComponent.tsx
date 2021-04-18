import React from 'react';

export interface Props {
    /**
  The theme
  */
    theme: string;
}
export const TestComponent: React.FC<Props> = ({ theme }) => (
    <div data-testid='test-component' className={`test-component test-component-${theme}`}>
        <h1 className='heading'>I&apos;m the test component </h1>
        <h2>Made with love by Harvey</h2>
    </div>
);

export default TestComponent;
