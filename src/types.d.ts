import '@emotion/react';
import { ThemeInterface } from './shared/theme';

declare module '@emotion/react' {
    export interface Theme extends ThemeInterface {}
}
