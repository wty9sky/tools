
const { ImageXClient } = require('@volcengine/imagex-openapi');
const config = require("../../core/config");

// 使用 ak/sk 实例化 Client

class VolcengineUpload {
    constructor() {
        this.accessKey = config.resource_bucket.volcengine.ACCESS_KEY
        this.secretKey = config.resource_bucket.volcengine.SECRET_KEY
        this.host = config.resource_bucket.volcengine.HOST
        this.region = config.resource_bucket.volcengine.REGION
        this.serviceId = config.resource_bucket.volcengine.CLIENT_ID
        this.client = null
    }

    inits() {
        const Client = new ImageXClient({
            // 必填，您的 AccessKey ID
            accessKey: this.accessKey,
            // 必填，您的 AccessKey Secret
            secretKey: this.secretKey,
            // 请在 https://www.volcengine.com/docs/508/14106 查询 region 填入
            region: this.region,
            // 请根据 region 对应的域名填入对应 host 信息(https://${host})
            host: this.host,
        });
        this.client = Client;
    }

    async uploadFile(file, filePath) {
        return new Promise(async (resolve, reject) => {
            try {
                const option = {
                    serviceId: this.serviceId, // 服务 ID
                    files: [file],
                    fileKeys: [filePath],
                };
                const res = await this.client.UploadImages(option);
                resolve(res);
            } catch (err) {
                console.error(err.response.data.error, 'das');
                reject(err);
            }
        })

    }
}

module.exports = VolcengineUpload;