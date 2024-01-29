const {
    HttpException
} = require('../core/http-exception')

const catcherr = async (ctx, next) => {
    try {
        // 若无错误，则next()继续运行
        await next()
    } catch (err) {
        // 若有错误，则需要判断错误类型
        // 是否为
        const isHttpException = err instanceof HttpException
        const isDev = 'dev'
        if (isDev && !isHttpException) {
            throw err
        }
        if (isHttpException) {
            ctx.body = {
                data: err.data ? err.data : null,
                msg: err.msg,
                errCode: err.errorCode,
                request: `${ctx.method}: ${ctx.path}`
            }
            // ctx.status = err.code
            // ctx.status = err.code==200||err.code==201?err.code:202
            ctx.status = err.code

        } else {
            logger.info(err)
            ctx.body = {
                msg: '服务器错误，请联系客服反馈',
                errCode: 999,
                request: `${ctx.method}: ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}


module.exports = catcherr