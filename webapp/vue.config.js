const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '.',
  assetsDir: 'frontend-vue',

  devServer: {
    proxy: {
      "^/api/": {
        target: "http://localhost:5000",
        pathRewrite: { "^/api/": "/" },
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})