/**
 * @description 工具函数
 * @author 双越
 */

const os = require('os')
const _ = require('lodash')

module.exports = {
    // 判断 windows 系统
    isWindows: os.type().toLowerCase().indexOf('windows') >= 0,

    /**
     * 将 obj 变为 string ，根据 key 排序
     * 如把 {b:2, a:1, c:3} 变为 'a=1&b=2&c=3'
     * @param {object} obj 对象
     */
    getSortedObjStr(obj = {}) {
        if (_.isEmpty(obj)) return ''

        const keys = Object.keys(obj).sort() // 获取排序之后的 keys
        const arr = keys.map(key => {
            const val = obj[key]
            return `${key}=${val}`
        })
        return arr.join('&')
    },
}
