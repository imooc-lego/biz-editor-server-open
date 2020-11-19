/**
 * @description 发送短信验证码
 * @author 双越
 */

const { getVeriCodeFromCache, setVeriCodeToCache } = require('../../cache/users/veriCode')
const { sendVeriCodeMsg } = require('../../vendor/sendMsg')
const {
    sendVeriCodeFrequentlyFailInfo,
    sendVeriCodeErrorFailInfo,
} = require('../../res-model/failInfo/index')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const { isDev, isTest, isPrd } = require('../../utils/env')
const { msgVeriCodeTimeout } = require('../../config/index')
const { mailAlarm } = require('../../alarm/index')

/**
 * 发送短信验证码
 * @param {string} phoneNumber 手机号
 * @param {boolean} isRemoteTest 是否测试
 */
async function sendVeriCode(phoneNumber, isRemoteTest = false) {
    // 从缓存获取验证码，看是否有效
    const codeFromCache = await getVeriCodeFromCache(phoneNumber)
    if (codeFromCache) {
        if (!isPrd) {
            // 非线上环境，直接返回
            return new SuccessRes({ code: codeFromCache })
        }
        // 说明刚刚已经发送过，不要再重新发送 —— 【注意】如不做这个限制，轻易重复发送，短信服务将浪费不少钱
        return new ErrorRes(sendVeriCodeFrequentlyFailInfo)
    }

    // 缓存中没有，则发送
    const veriCode = Math.random().toString().slice(-4) // 生成随机数
    let sendSuccess = false

    if (isTest) {
        // 本地接口测试，不发短信，直接返回验证码。发短信，会有单独的接口测试。
        sendSuccess = true
    } else if (isRemoteTest) {
        // 用于远程接口测试，也不用发短信
        sendSuccess = true
    } else {
        // 其他情况，正式发短信
        try {
            // 短信提示的过期时间（单位分钟）
            const msgTimeoutMin = (msgVeriCodeTimeout / 60).toString()
            // 发送短信
            await sendVeriCodeMsg(phoneNumber, veriCode, msgTimeoutMin)
            sendSuccess = true
        } catch (ex) {
            sendSuccess = false
            console.error('发送短信验证码错误', ex)

            mailAlarm('发送短信验证码错误', ex) // 报警
        }
    }

    if (!sendSuccess) {
        return new ErrorRes(sendVeriCodeErrorFailInfo)
    }

    // 缓存，设置 timeout，重要！！！
    setVeriCodeToCache(phoneNumber, veriCode, msgVeriCodeTimeout)

    // 返回成功信息
    const resData = isPrd ? {} : { code: veriCode } // 非线上环境，返回验证码
    return new SuccessRes(resData)
}

module.exports = sendVeriCode
