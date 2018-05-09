/*
 * 将打包后docs文件夹下的img/css/js目录下的文件上传至七牛云
 * 上传完成后，刷新文件CDN缓存
 */
const qiniu = require('qiniu');
const async = require('async');
const path = require('path');
const fs = require('fs');

const accessKey = 'Thrd_hTxE6cHJ20troUaGX6OQLx2V_8f2fyoutA8';
const secretKey = 'OImAWyjLK7NDF2A7fy2AAiJnHqXB2oZaSKV_j2AL';
const bucket = '67one';
const urlPrefix = 'http://static.67one.com/';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();
const cdnManager = new qiniu.cdn.CdnManager(mac);

let docsPath = path.resolve(__dirname, './docs/');
let docs = fs.readdirSync(docsPath);
let files = [], refreshUrlCDN = [];

docs.forEach(item => {
    let fileDirPath = docsPath.replace(/\\/g, '/') + '/' + item;
    let stat = fs.statSync(fileDirPath)
    if(stat.isDirectory()){
        let filesList = fs.readdirSync(fileDirPath);
        filesList.forEach(file => {
            files.push({
                filename: item + '/' + file,
                path: fileDirPath.replace(/\\/g, '/') + '/' + file
            })
        })
    }
});

function uploadFile(filename, localFile, cb) {
    let options = {
        scope: bucket + ":" + filename,
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(fname)"}'
    }

    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);

    formUploader.putFile(uploadToken, filename, localFile, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) cb(respErr);
        if (respInfo.statusCode !== 200) cb(respBody);

        if (respInfo.statusCode === 200) {
            cb(null, respBody)
        }
    });
}

async.eachSeries(files, (item, callback) => {
    uploadFile(item.filename, item.path, callback);
}, (errors, results) => {
    if(!errors){
        files.forEach(item => refreshUrlCDN.push(urlPrefix + item.filename))
        cdnManager.refreshUrls(refreshUrlCDN, (err, body, info) => {
            if (err) throw err;
            if (info.statusCode !== 200) throw body;

            if (info.statusCode == 200) {
                console.log('上传至七牛云成功，并刷新缓存，每日刷新文件缓存剩余次数：' + JSON.parse(body).urlSurplusDay)
            }
        });
    }
});
