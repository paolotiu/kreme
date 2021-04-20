import { css } from '@emotion/react';
import normalize from './normalize';
import { colors, typography } from './styles';

export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const globalStyles = css`
    ${normalize}

    body {
        color: ${colors.darkest};
        font-family: ${typography.type.primary};
    }

    div[role='button'] {
        :not(:focus-visible) {
            outline: none;
        }
    }
`;
