/**
 * @description 作品 Model
 * @author 双越
 */

const seq = require('../db/seq/seq')
const { INTEGER, STRING, BOOLEAN, DATE } = require('../db/seq/types')
const UserModel = require('./UserModel')

// 作品
const Work = seq.define('work', {
    uuid: {
        type: STRING,
        allowNull: false,
        unique: 'uuid',
        comment: 'uuid，h5 url 中使用，隐藏真正的 id，避免被爬虫',
    },
    title: {
        type: STRING,
        allowNull: false,
        comment: '标题',
    },
    desc: {
        type: STRING,
        comment: '副标题',
    },
    contentId: {
        type: STRING,
        allowNull: false,
        unique: 'contentId',
        comment: '内容 id ，内容存储在 mongodb 中',
    },
    publishContentId: {
        type: STRING,
        unique: 'publishContentId',
        comment: '发布内容 id ，内容存储在 mongodb 中，未发布的为空',
    },
    author: {
        type: STRING,
        allowNull: false,
        comment: '作者 username',
    },
    coverImg: {
        type: STRING,
        comment: '封面图片 url',
    },
    isTemplate: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否是模板',
    },
    status: {
        type: STRING,
        allowNull: false,
        defaultValue: 1,
        comment: '状态：0-删除，1-未发布，2-发布，3-强制下线',
    },
    // viewedCount: {
    //     type: INTEGER,
    //     allowNull: false,
    //     defaultValue: 0,
    //     comment: '被浏览次数',
    // },
    copiedCount: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '被复制的次数',
    },
    latestPublishAt: {
        type: DATE,
        defaultValue: null,
        comment: '最后一次发布的时间',
    },
    isHot: {
        type: BOOLEAN,
        defaultValue: false,
        comment: 'hot 标签，模板使用',
    },
    isNew: {
        type: BOOLEAN,
        defaultValue: false,
        comment: 'new 标签，模板使用',
    },
    orderIndex: {
        type: INTEGER,
        defaultValue: 0,
        comment: '排序参数',
    },
    isPublic: {
        type: BOOLEAN,
        defaultValue: false,
        comment: '是否公开显示，在首页公共的模板列表',
    },
})

// 和 UserModel 建立关系
Work.belongsTo(UserModel, {
    foreignKey: 'author',
    targetKey: 'username', // 对应 UserModel.username 属性
})

module.exports = Work
