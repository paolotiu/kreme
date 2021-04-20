const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    webpackFinal: async (config) => {
        const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));
        fileLoaderRule.exclude = /\.svg$/;

        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
            include: path.resolve(__dirname, '../'),
        });
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                plugins: ['emotion'],
                presets: [['react-app', { flow: false, typescript: true }]],
            },
        });
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
