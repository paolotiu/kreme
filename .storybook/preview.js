import { Global, ThemeProvider } from '@emotion/react';
import React from 'react';
import { globalStyles } from '../src/shared/global';
import Theme from '../src/shared/theme';
export const decorators = [
    (Story) => (
        <>
            <Global styles={globalStyles} />
            <ThemeProvider theme={Theme}>
                <Story />
            </ThemeProvider>
        </>
    ),
];
