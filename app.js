const Koa = require('koa')
const path = require('path')
const InitManager = require('./app/core/init')
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')
const catchError = require('./app/middleware/exception')

const app = new Koa()

app.use(cors(
    {
        methods: ['GET', 'POST', 'DELETE', 'PATCH']
    }
))

app.use(koaBody({
    multipart: true, // 支持文件上传
    encoding: 'gzip',
    formidable: {
        // uploadDir:path.join(__dirname,'static/upload/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 5 * 1024 * 1024, // 文件上传大小
        multipart: true
        // onFileBegin:(name,file) => {
        //   // console.log(file);
        //   // 获取文件后缀
        //   const ext =getUploadFileExt(file.name);
        //   // 最终要保存到的文件夹目录
        //   const dir = path.join(__dirname,`static/upload/${getUploadDirName()}`);
        //   // 检查文件夹是否存在如果不存在则新建文件夹
        //   checkDirExist(dir);
        //   // 重新覆盖 file.path 属性
        //   file.path = `${dir}/${getUploadFileName(ext)}`;
        // },

    }
}));
app.use(catchError);


InitManager.initCore(app);

app.listen(5510);