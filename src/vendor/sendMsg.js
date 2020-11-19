/**
 * @description 发送短信
 * @author 双越
 */

const tencentcloud = require('tencentcloud-sdk-nodejs')
const { tencentMsgConf } = require('../config/index')

const SmsClient = tencentcloud.sms.v20190711.Client
const models = tencentcloud.sms.v20190711.Models
const { Credential } = tencentcloud.common
const { SECRET_ID, SECRET_KEY } = tencentMsgConf
const cred = new Credential(SECRET_ID, SECRET_KEY)
const client = new SmsClient(cred)

/**
 * 创建短信 req 对象
 * @param {string} templateId 短信模板 id
 */
function genSmsRequest(templateId) {
    const req = new models.SendSmsRequest()
    req.SmsSdkAppid = '123' // 控制台，应用管理，应用列表 https://console.cloud.tencent.com/smsv2/app-manage
    req.Sign = '慕课乐高' // 控制台，国内短信，签名管理 https://console.cloud.tencent.com/smsv2/csms-sign
    req.TemplateID = templateId // 控制台，国内短信，正文模板管理 https://console.cloud.tencent.com/smsv2/csms-template
    return req
}

/**
 * 发送短信验证码
 * @param {string} phoneNumber 手机号
 * @param {string} code 验证码
 * @param {string} timeout 过期时间，分钟
 */
async function sendVeriCodeMsg(phoneNumber, code, timeout = '') {
    if (!phoneNumber || !code) return Promise.reject(new Error('手机号或验证码为空'))

    const req = genSmsRequest('741051')
    req.PhoneNumberSet = [`+86${phoneNumber}`] // 手机号，可群发
    req.TemplateParamSet = [code, timeout] // 为模板内容注入参数

    return new Promise((resolve, reject) => {
        // 发送短信
        client.SendSms(req, (err, res) => {
            if (err) {
                // 失败
                reject(err)
                return
            }
            // 成功
            resolve(res)
        })
    })
}

module.exports = {
    sendVeriCodeMsg,
}
