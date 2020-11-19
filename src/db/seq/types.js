/**
 * @description 封装 sequelize 类型，参考 https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/data-types.md
 * @author 双越
 */

const Sequelize = require('sequelize')

module.exports = {
    STRING: Sequelize.STRING, // VARCHAR(255)
    TEXT: Sequelize.TEXT, // TEXT
    INTEGER: Sequelize.INTEGER,
    BOOLEAN: Sequelize.BOOLEAN,
    DATE: Sequelize.DATE,
}
