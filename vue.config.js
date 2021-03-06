module.exports = {
    devServer: {
        //解决开发环境跨域
        proxy: {
            '/api': {
                target: process.env.API_DEVELOPMENT,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
