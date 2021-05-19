import '@emotion/react';
import { ThemeInterface } from './shared/theme';

declare module '@emotion/react' {
    export interface Theme extends ThemeInterface {}
}

declare module 'react-dnd-multi-backend' {
    export const usePreview: any;
}
