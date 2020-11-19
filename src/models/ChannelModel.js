/**
 * @description 渠道 Model
 * @author 双越
 */

const seq = require('../db/seq/seq')
const { INTEGER, STRING } = require('../db/seq/types')

// 渠道
const Channel = seq.define('channel', {
    name: {
        type: STRING,
        allowNull: false,
        comment: '渠道名称',
    },
    workId: {
        type: INTEGER,
        allowNull: false,
        comment: '作品 id',
    },
    status: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '状态：0-删除，1-正常',
    },
})

module.exports = Channel
