/**
 * @description 数据校验 作品
 * @author 双越
 */

// 普通字符串的规则
const strRule = {
    type: 'string',
    maxLength: 255,
}
const numRule = {
    type: 'number',
}
const boolRule = {
    type: 'boolean',
}

// 创建作品 schema
const workInfoSchema = {
    type: 'object',
    // 用户信息要符合 WorksModel 配置
    required: ['title'],
    properties: {
        title: strRule,
        desc: strRule,
        coverImg: strRule,
        contentId: strRule,

        // 作品内容 —— 这个并不在 WorksModel 中！！！
        content: {
            type: 'object',
            // 符合 WorkContentModel 属性规则
            properties: {
                _id: strRule,
                components: {
                    type: 'array',
                },
                props: {
                    type: 'object',
                },
                setting: {
                    type: 'object',
                },
            },
        },
    },
}

module.exports = {
    workInfoSchema,
}
