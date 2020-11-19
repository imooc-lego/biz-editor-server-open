/**
 * @description 生成一个密码。手机号注册时，需要生成一个随机的密码
 * @author 双越
 */

const { v4: uuidV4 } = require('uuid')

/**
 * 生成一个密码
 */
module.exports = function genPassword() {
    const s = uuidV4() // 格式如 5e79b94b-548a-444a-943a-8a09377e3744
    return s.split('-')[0]
}
