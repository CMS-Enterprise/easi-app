const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-controls',
  ],
  webpackFinal: (config) => {
    config.resolve.modules = [
      // Resolve absolute import paths
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../src')
    ];

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.resolve(__dirname, '../src/stylesheets/_colors.scss'),
              path.resolve(__dirname, '../src/stylesheets/_variables.module.scss'),
              path.resolve(__dirname, '../src/stylesheets/_uswdsUtilities.scss')
            ]
          }
        }
      ],
      include: path.resolve(__dirname, '../src'),
    });
    return config;
  }
}
