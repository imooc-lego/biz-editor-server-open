/**
 * @description jest server
 * @author 双越老师
 */

const axios = require('axios')
const supertest = require('supertest')
const { isTestRemote, isTestLocal } = require('../../src/utils/env')

let request
if (isTestLocal) {
    // 本地测试才使用 supertest 。src/app 也要在此时引用，否则在 github actions 中初始化时，会报数据库连接错误。
    const server = require('../../src/app').callback() // eslint-disable-line
    request = supertest(server)
}

// 存储登录 token ，统一拼接 headers.Authorization
let TOKEN = ''

// 测试机 host
const REMOTE_HOST = 'http://182.92.xxx.xxx:8081'

/**
 * 发送请求
 * @param {string} method method
 * @param {string} url url
 * @param {object} bodyOrParams body / query
 * @param {object} headers headers
 */
async function ajax(method = 'get', url = '', bodyOrParams = {}, headers = {}) {
    // headers 加 token
    if (headers.Authorization == null) {
        Object.assign(headers, {
            Authorization: `Bearer ${TOKEN}`,
        })
    }

    let result

    // 本地测试，使用 supertest
    if (isTestLocal) {
        let res
        if (method === 'get') {
            res = await request[method](url).query(bodyOrParams).set(headers)
        } else {
            res = await request[method](url).send(bodyOrParams).set(headers)
        }
        result = res.body
    }

    // 远程测试，使用 axios ，访问测试机
    if (isTestRemote) {
        const remoteUrl = `${REMOTE_HOST}${url}`
        const conf = {
            method,
            url: remoteUrl,
            headers,
        }
        if (method === 'get') {
            conf.params = bodyOrParams
        } else {
            conf.data = bodyOrParams
        }
        const res = await axios(conf)
        result = res.data
    }

    // 返回结果
    return result // { data, errno }
}

module.exports = {
    setToken(token) {
        console.log('setToken...', token)
        TOKEN = token
    },
    async get(url, params) {
        const res = await ajax('get', url, params)
        return res
    },
    async post(url, body) {
        const res = await ajax('post', url, body)
        return res
    },
    async patch(url, body) {
        const res = await ajax('patch', url, body)
        return res
    },
    async del(url, body) {
        const res = await ajax('delete', url, body)
        return res
    },
}
