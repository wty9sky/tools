const Router = require("@koa/router")
const router = new Router()
const UploadController = require('../contorllers/upload.controller')
const { Success } = require('../core/http-exception')

const upload = new UploadController();

router.prefix('/assets')


// 文件
router.post('/upload/file', async (ctx, next) => {
    const file = ctx.request.files.file;
    let result = await upload.fileUpload(file, 'file');
    throw new Success(result, '添加成功')
})

// 头像上传
router.post('/upload/avatar', async (ctx, next) => {
    const file = ctx.request.files.file;
    let result = await upload.fileUpload(file, 'avatar');
    throw new Success(result, '添加成功')
})

module.exports = router;
