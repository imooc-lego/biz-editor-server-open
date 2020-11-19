/**
 * @description 发送邮件
 * @author 双越
 */

const nodemailer = require('nodemailer')

// 创建发送邮件的客户端
const transporter = nodemailer.createTransport({
    host: 'smtp.126.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'imooclego@126.com',
        pass: 'xxx',
    },
})

/**
 * @param {Array} mails 邮箱列表
 * @param {string} subject 邮件主题
 * @param {string} content 邮件内容，支持 html 格式
 */
async function sendMail(mails = [], subject = '', content = '') {
    if (!mails.length) return
    if (!subject || !content) return

    // 邮件配置
    const conf = {
        from: '"imooc-lego" <imooclego@126.com>',
        to: mails.join(','),
        subject,
    }
    if (content.indexOf('<') === 0) {
        // html 内容
        conf.html = content
    } else {
        // text 内容
        conf.text = content
    }

    // 发送邮件
    const res = await transporter.sendMail(conf)

    console.log('mail sent: %s', res.messageId)
}

module.exports = sendMail
