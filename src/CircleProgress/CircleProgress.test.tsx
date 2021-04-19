import React from 'react';
import { render } from '@testing-library/react';

import { ThemeProvider } from '@emotion/react';
import Theme from '../shared/theme';
import CircleProgress, { Props, getProgressStrokeValue } from './CircleProgress';

describe('Test Component', () => {
    const renderComponent = (props: Props) =>
        render(
            <ThemeProvider theme={Theme}>
                <CircleProgress {...props} />
            </ThemeProvider>,
        );

    it('Should render correctly', () => {
        const props: Props = {
            progress: 70,
        };
        const computedProgress = getProgressStrokeValue(70);
        const { getByTestId } = renderComponent(props);
        const progress = getByTestId('progress');
        const styles = window.getComputedStyle(progress);

        expect(parseFloat(styles.strokeDasharray.split(',')[0])).toBe(computedProgress);
        expect(progress).toBeTruthy();
    });
});
