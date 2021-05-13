import { ThemeProvider } from '@emotion/react';
import React from 'react';
import theme from './theme';

interface Props {
    children: React.ReactNode;
}

const KremeProvider = ({ children }: Props) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default KremeProvider;
