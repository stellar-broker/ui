const {initWebpackConfig} = require('@stellar-expert/webpack-template')
const pkgInfo = require('./package.json')

module.exports = initWebpackConfig({
    entries: {
        'sbui': {
            import: './src/index.js',
            htmlTemplate: './src/static-template/index.html'
        }
    },
    outputPath: './distr/',
    staticFilesPath: ['./src/static/'],
    define: {
        appVersion: pkgInfo.version,
        managementApiOrigin: process.env.API_ORIGIN || 'https://management.stellar.broker'
    },
    devServer: {
        host: '0.0.0.0',
        server: {
            type: 'https'
        },
        port: 9001
    },
    inlineSvg: true
})
