const qiniu = require("qiniu");
const config = require("../../core/config");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.resource_bucket.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.resource_bucket.qiniu.SECRET_KEY;

class QiniuUpload {
    constructor() {
        this.bucket = config.resource_bucket.qiniu.BUCKET_NAME;
        this.accessKey = config.resource_bucket.qiniu.ACCESS_KEY;
        this.secretKey = config.resource_bucket.qiniu.SECRET_KEY;
    }


    //构建上传策略函数
    uptoken(key) {
        const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
        let putPolicy = new qiniu.rs.PutPolicy({
            scope: this.bucket,
            saveKey: key
        });
        // const uploadToken = putPolicy.uploadToken(mac);
        // return putPolicy.token();
        return putPolicy.uploadToken(mac);
    }

    uploadFile(key, localFile) {
        //生成上传 Token
        const token = this.uptoken(key);
        const extra = new qiniu.form_up.PutExtra();
        const configs = new qiniu.conf.Config()
        configs.zone = qiniu.zone.Zone_z0
        const formUploader = new qiniu.form_up.FormUploader(configs);
        return new Promise((resolve, reject) => {
            formUploader.putStream(token, key, localFile, extra, function (err, respBody, respInfo) {
                if (!err) {
                    // 上传成功， 处理返回值
                    resolve(respBody)
                } else {
                    // 上传失败， 处理返回代码
                    reject(err)
                }
            });
        })
    }
}

module.exports = QiniuUpload;
