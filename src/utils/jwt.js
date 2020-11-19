/**
 * @description jwt - verify sign
 * @author 双越
 */

const util = require('util')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/constant')
const { jwtExpiresIn } = require('../config/index')

const verify = util.promisify(jwt.verify)

/**
 * jwt verify
 * @param {string} token token
 */
async function jwtVerify(token) {
    const data = await verify(token.split(' ')[1], JWT_SECRET) // 去掉前面的 Bearer
    return data
}

/**
 * jwt sign
 * @param {Object} data data
 */
function jwtSign(data) {
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: jwtExpiresIn })
    return token
}

module.exports = {
    jwtVerify,
    jwtSign,
}
