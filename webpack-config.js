const path = require('path')
const {initWebpackConfig} = require('@stellar-expert/webpack-template')
const pkgInfo = require('./package.json')

const isProduction = !process.argv.some(a => a === '--mode=development')

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
        appVersion: pkgInfo.version
    },
    devServer: {
        host: '0.0.0.0',
        https: true,
        port: 9001
    },
    inlineSvg: true,
    ignoreCallback: function (resource, context) {
        if (/bip39[/\\]src$/.test(context)) {
            if (resource.includes('/wordlists/')) {
                return !resource.includes('english.json')
            }
        }
        return false
    }
})
