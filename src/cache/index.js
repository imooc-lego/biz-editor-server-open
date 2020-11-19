/**
 * @description 数据缓存
 * @author 双越
 */

const redisClient = require('../db/redis')

/**
 * redis set
 * @param {string} key key
 * @param {string|Object} val val
 * @param {number} timeout 过期时间，单位 s ，默认 1h
 */
function cacheSet(key, val, timeout = 60 * 60) {
    let formatVal
    if (typeof val === 'object') {
        formatVal = JSON.stringify(val)
    } else {
        formatVal = val
    }
    redisClient.set(key, formatVal)
    redisClient.expire(key, timeout)
}

/**
 * redis get
 * @param {string} key key
 */
function cacheGet(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve(JSON.parse(val))
            } catch (ex) {
                resolve(val)
            }
        })
    })
    return promise
}

module.exports = {
    cacheSet,
    cacheGet,
}
