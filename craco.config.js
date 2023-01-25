/*
  Upgrading to CRA 5.0 introduced some sourcemap warnings
  Adding webpack config to ignore until fixed in 5.1
  https://github.com/facebook/create-react-app/discussions/11767
*/

module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        }
      ]
    }
  },
  style: {
    sass: {
      loaderOptions: {
        sourceMap: true,
        sassOptions: {
          includePaths: [
            './src/stylesheets',
            './node_modules/@uswds/uswds/packages'
          ]
        }
      }
    }
  }
};
