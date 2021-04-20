import { Global, ThemeProvider } from '@emotion/react';
import React from 'react';
import { globalStyles } from './global';
import theme from './theme';

interface Props {
    children: React.ReactNode;
}

const KremeProvider = ({ children }: Props) => (
    <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        {children}
    </ThemeProvider>
);

export default KremeProvider;
