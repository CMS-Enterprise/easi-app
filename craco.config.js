module.exports = {
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
