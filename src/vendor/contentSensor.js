/**
 * @description 内容审核。保证内容安全，无政治血腥暴力等敏感信息
 * @author 双越
 */

const AipContentCensorClient = require('baidu-aip-sdk').contentCensor
const { baiduCloudCensorConf } = require('../config/index.js')
const { mailAlarm } = require('../alarm/index')

// 实例化客户端
const { APP_ID, API_KEY, SECRET_KEY } = baiduCloudCensorConf
const client = new AipContentCensorClient(APP_ID, API_KEY, SECRET_KEY)

/**
 * 文本审核
 * @param {string} text 文本内容
 * @returns {null|Array} null 或失败信息
 */
async function textCensor(text = '') {
    if (!text.trim()) return null

    let res
    try {
        // 执行审核
        res = await client.textCensorUserDefined(text)
    } catch (ex) {
        console.error('百度云 textCensor 错误', ex)
        mailAlarm('百度云 textSensor 错误', ex) // 报警
    }

    if (res == null) {
        // 审查出错，也不能妨碍用户发布信息。此时，我们需要及时修复错误，并人工处理已发布的信息。
        return null
    }

    if (res.conclusionType !== 2) {
        // 没有失败
        return null
    }

    // 检查失败
    console.log('内容审查失败, text', text)
    console.log('内容审查失败, res', JSON.stringify(res, null, 4))

    // 获取失败信息，并分析
    const { data = [] } = res
    /**
    data: [
        {
            msg: '存在政治敏感不合规',
            conclusion: '不合规',
            hits: [{"datasetName":"百度默认黑词库","words":["六四事件"]}, {...}],
            subType: 3,
            conclusionType: 2,
            type: 12
        },
        {...},
        {...}
    ]
    */
    // 拼接所有的关键字
    let keywords = []
    data.forEach((item = {}) => {
        const { hits = [] } = item
        hits.forEach((hit = {}) => {
            const { words = [] } = hit
            if (words.length === 0) return
            keywords = keywords.concat(words) // 收集关键字
        })
    })
    if (keywords.length) return keywords

    // 虽然失败，但没有关键字 - 遇到过这种情况，可能是百度云的一个 bug
    return null
}

/**
 * 审核图片
 * @param {string} imgUrl 图片url
 * @returns {null|Array} null 或失败信息
 */
async function imgCensor(imgUrl) {
    if (!imgUrl.trim()) return null

    let res
    try {
        // 执行检查
        res = await client.imageCensorUserDefined(imgUrl, 'url')
    } catch (ex) {
        console.error('百度云 imgCensor 错误', ex)
        mailAlarm('百度云 imgCensor 错误', ex) // 报警
    }

    if (res == null) {
        // 审查出错，也不能妨碍用户发布信息。此时，我们需要及时修复错误，并人工处理已发布的信息。
        return null
    }

    if (res.conclusionType !== 2) {
        // 未失败
        return null
    }

    // 检查失败
    console.log('图片审查失败, imgUrl', imgUrl)
    console.log('图片审查失败, res', JSON.stringify(res, null, 4))

    // 获取失败信息，并分析
    const { data } = res
    /**
    data: [
        {
            msg: '存在政治敏感不合规',
            conclusion: '不合规',
            subType: 0,
            conclusionType: 2,
            stars: [
                { "probability": 0.94308, "name": "习近平" },
                { "probability": 0.44308, "name": "彭丽媛" }
            ],
            type: 5
        },
        {...},
        {...}
    ]
    */

    // 收集所有关键字
    let keywords = []
    data.forEach((item = {}) => {
        const { stars = [] } = item
        if (stars.length === 0) return
        keywords = keywords.concat(stars.map(s => `${s.name}(图片)`))
    })
    if (keywords.length) return keywords

    // 虽然失败，但没有关键字 - 遇到过这种情况，可能是百度云的一个 bug
    return null
}

module.exports = {
    textCensor,
    imgCensor,
}
