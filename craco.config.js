const sassResourcesLoader = require('craco-sass-resources-loader');

module.exports = () => {
  return {
    plugins: [
      {
        plugin: sassResourcesLoader,
        options: {
          resources: [
            './src/stylesheets/_colors.scss',
            './src/stylesheets/_variables.scss'
          ]
        }
      }
    ],
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => !(plugin.options && 'eslintPath' in plugin.options)
        );
        return webpackConfig;
      }
    }
  };
};
