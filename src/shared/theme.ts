import { colors, typography, spacing, transition } from './styles';

const Theme = {
    colors,
    typography,
    spacing,
    transition,
};
type T = typeof Theme;
export interface ThemeInterface extends T {}
export default Theme;
