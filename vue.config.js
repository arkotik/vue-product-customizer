module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/customizer/' : '/',
  devServer: {
    port: 8090
  }
};
