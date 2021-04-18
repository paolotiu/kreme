const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    webpackFinal: async (config) => {
        return {
            ...config,
            resolve: {
                // Emotion ThemeProvider workaround https://github.com/mui-org/material-ui/issues/24282#issuecomment-796755133
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                    '@emotion/core': toPath('node_modules/@emotion/react'),
                    'emotion-theming': toPath('node_modules/@emotion/react'),
                },
            },
        };
    },
};
