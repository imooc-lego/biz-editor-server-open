/**
 * @description 上传图片
 * @author 双越
 */

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const formidable = require('formidable')
const { isWindows } = require('../../utils/util')
const { uploadImgFailInfo } = require('../../res-model/failInfo/index')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const uploadOSS = require('../../vendor/uploadOSS')

// windows 系统，临时存储文件的目录
const TMP_PATH_WINDOWS = 'tmp-files-windows'

const form = formidable({ multiples: true })

// windows 系统，处理 rename 报错
if (isWindows) {
    const tmpPath = path.resolve(__dirname, '..', '..', '..', TMP_PATH_WINDOWS)
    if (!fs.existsSync(tmpPath)) {
        fs.mkdirSync(tmpPath)
    }
    form.uploadDir = TMP_PATH_WINDOWS
}

/**
 * 给 fileName 加个后缀，防止重复。如 `a.png` 变为 `a-xxx.png`
 */
function addSuffixForFileName(fileName = '') {
    // 用随机数，做一个后缀
    const suffix = Math.random().toString().slice(-6)

    if (!fileName) return ''
    const lastPointIndex = fileName.lastIndexOf('.')
    if (lastPointIndex < 0) {
        // 文件名没有后缀名
        return `${fileName}-${suffix}`
    }

    // 文件名有后缀名
    return `${fileName.slice(0, lastPointIndex)}-${suffix}${fileName.slice(lastPointIndex)}`
}

/**
 * 通过 formidable 上传图片
 * @param {object} req ctx.req
 */
function uploadImgByFormidable(req) {
    const p = new Promise((resolve, reject) => {
        form.parse(req, async function upload(err, fields, files) {
            if (err) {
                reject(err)
            }

            // console.log('fields.....', fields) // formData 其他参数，格式如如 { bbb: '123', ccc: 'abc' }

            // 遍历所有图片，并上传
            const filesKeys = Object.keys(files)
            try {
                const links = await Promise.all(
                    filesKeys.map(name => {
                        const file = files[name]
                        let fileName = file.name || name
                        fileName = addSuffixForFileName(fileName) // 给 name 加个后缀，防止名称重复
                        return uploadOSS(fileName, file.path)
                    })
                )
                // for (name of filesKeys) {
                //     const file = files[name]
                //     let fileName = file.name || name
                //     fileName = addSuffixForFileName(fileName) // 给 name 加个后缀，防止名称重复
                //     const url = await uploadOSS(fileName, file.path)
                //     links.push(url)
                // }

                // 删除源文件
                _.forEach(files, file => {
                    fs.unlinkSync(file.path)
                })
                // 返回结果
                resolve(links)
            } catch (ex) {
                reject(ex)
            }
        })
    })
    return p
}

/**
 * 上传图片
 * @param {object} req ctx.req
 */
async function uploadImg(req) {
    let urls
    try {
        urls = await uploadImgByFormidable(req)
    } catch (ex) {
        console.error('上传图片错误', ex)
        return new ErrorRes(uploadImgFailInfo)
    }

    return new SuccessRes({
        urls,
    })
}

module.exports = uploadImg
