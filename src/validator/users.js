/**
 * @description 数据校验 users
 * @author 双越
 */

// 手机号规则
const phoneNumberRule = {
    type: 'string',
    pattern: '^1[34578]\\d{9}$', // 手机号正则
}

// 手机号 schema
const phoneNumberSchema = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        phoneNumber: phoneNumberRule,
        isRemoteTest: {
            type: 'boolean',
        },
    },
}

// 手机号 + 短信验证码 schema
const phoneNumberVeriCodeSchema = {
    type: 'object',
    required: ['phoneNumber', 'veriCode'],
    properties: {
        phoneNumber: phoneNumberRule,
        veriCode: {
            type: 'string',
            pattern: '^\\d{4}$', // 四位数字
        },
    },
}

// 用户信息 schema
const userInfoSchema = {
    type: 'object',
    // 用户信息要符合 UserModel 配置
    required: ['nickName', 'gender'],
    properties: {
        nickName: {
            type: 'string',
        },
        gender: {
            type: 'integer', // 整数
            minimum: 0,
            maximum: 2,
        },
        picture: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
    },
}

module.exports = {
    phoneNumberSchema,
    phoneNumberVeriCodeSchema,
    userInfoSchema,
}
