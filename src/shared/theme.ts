import { colors, typography, spacing, transition } from './styles';

export const theme = {
    colors,
    typography,
    spacing,
    transition,
};
type T = typeof theme;
export interface ThemeInterface extends T {}

export default theme;
