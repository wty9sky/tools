const QiniuUpload = require("../utils/uploads/qiniu");
const VolcengineUpload = require("../utils/uploads/volcengine");
const {
    getUuid
} = require('../utils/uuid');
const config = require('../core/config')
const path = require('path')
const fs = require("fs")


const qiniu = new QiniuUpload()
const volcengine = new VolcengineUpload()


const uploadBucket = {
    custom: (file, fileName, dir) => {
        const timestamp = new Date().valueOf()
        // 创建可读流
        let filePath = path.join(__dirname, `..static/upload/${dir}`) + ` / ${fileName}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        let filename = String(timestamp) + String(Math.floor(Math.random() * 1000)) + path.extname(file.name);
        let fileOldPath = `./static/upload/${dir}/${fileName}`;
        let fileNewPath = `./static/upload/${dir}/${fileName}`;
        fs.rename(fileOldPath, fileNewPath, function (err) {
            if (err) {
                throw err;
            }
        })
        let fileUrl = uploadUrl + `/ ${filename}`
        return {
            url: fileUrl,
            type: 'custom'
        }
    },
    qiniu: (file, fileName, dir) => {
        return new Promise((resolve, reject) => {
            qiniu.uploadFile(`${dir}/${fileName}_${getUuid(8)}.png`, file).then(res => {
                resolve({
                    url: 'https://assets.swdwiki.com/' + res.key,
                    type: 'qiniu'
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    volcengine: (file, fileName, dir) => {
        volcengine.inits();
        return new Promise((resolve, reject) => {
            volcengine.uploadFile(file, `${dir}/${fileName}_${getUuid(8)}.png`).then(res => {
                resolve({
                    url: 'https://files.swdwiki.com/' + res.Result.Results[0].Uri,
                    type: 'volcengine'
                });
            }).catch(err => {
                console.log(err, '上传错误')
                reject(err)
            })
        })
    }
}


//返回值：fileName 原始全称文件名，emoverExtFileName 去除后缀的文件名，ext 文件后缀名
const fileExtName = (fileAllName) => {
    let file = fileAllName;
    let index = file.indexOf('.'); // .字符出现的位置
    let num = 0; // ‘.’出现的次数
    while (index !== -1) {
        num++;
        index = file.indexOf('.', index + 1);
    }
    if (num === 1) {//文件名只出现一次'.'符号
        let parmsFile = fileAllName;
        let getFileExtName = parmsFile.split('.')
        let fileName = getFileExtName[0];
        let extName = getFileExtName[1];
        return {
            fileName: fileAllName,
            emoverExtFileName: fileName,
            ext: extName
        }
    } else {//文件名只出现多次'.'符号
        let parmsFile = fileAllName;
        let getFileExtName = parmsFile.split('.')
        let extName = getFileExtName[getFileExtName.length - 1];
        let fileName = '';
        for (let i = 0; i < getFileExtName.length; i++) {
            if (i === getFileExtName.length - 1) break
            fileName += getFileExtName[i] + '.'
        }
        fileName = fileName.substr(0, fileName.length - 1)
        return {
            fileName: fileAllName,
            emoverExtFileName: fileName,
            ext: extName
        }
    }
}

class UploadController {
    async fileUpload(file, dir) {
        const { reader, fileNameText } = this.actionFile(file);
        const mainBucket = config.resource_bucket.mainBucket
        return new Promise((resolve, reject) => {
            uploadBucket[mainBucket](reader, fileNameText, dir).then(res => {
                resolve(res)
            }).catch(err => {
                console.log(err)
                reject(err)
            })

        })
    }

    // 处理文件
    actionFile = (file) => {
        const filename = file.originalFilename;
        const reader = fs.createReadStream(file.filepath);
        return {
            reader,
            filename,
            ext: fileExtName(filename)['ext'],
            fileNameText: fileExtName(filename)['emoverExtFileName'],
        };
    }
}


module.exports = UploadController