import { Theme } from '@emotion/react';

export const transitionDurationEase = (theme: Theme) => `${theme.transition.duration} ${theme.transition.ease}`;
