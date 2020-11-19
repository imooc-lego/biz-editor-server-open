/**
 * @description 加密
 * @author 双越老师
 */

const crypto = require('crypto')
const { PASSWORD_SECRET } = require('../config/constant')

// md5 加密
function md5Fn(content) {
    const md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

/**
 * 加密
 * @param {string} content 要加密的内容
 */
function doCrypto(content) {
    const str = `password=${content}&key=${PASSWORD_SECRET}`
    return md5Fn(str)
}

module.exports = doCrypto
