const config = {
    baseUrl: '',//配置的域名
    port: 3001,//api访问的端口
    tokenSecret: "",//token的加密
    wsPort: 3100,//WebSocket的端口号

    //数据库相关的配置
    db: {
        dbName: "",//数据库名称
        user: '',//mysql用户名
        password: '',//mysql密码
        port: '',//mysql端口号
        host: '',//服务器ip
        logging: false,
        timezone: '+08:00'
    },
    resource_bucket: {
        mainBucket: '',
        qiniu: {
            ACCESS_KEY: '',
            SECRET_KEY: '',
            BUCKET_NAME: '',
        },
        volcengine: {
            ACCESS_KEY: '',
            SECRET_KEY: '',
            HOST: '',
            REGION: '',
            CLIENT_ID: ''
        }
    },
    outputUrl: ''
}
//导出一整个模块


module.exports = config;