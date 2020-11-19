/**
 * @description 配置项
 * @author 双越
 */

const { isPrd, isPrdDev } = require('../utils/env')

// 获取各个环境的不同配置文件
let fileName = 'dev.js'
if (isPrdDev) fileName = 'prd-dev.js'
if (isPrd) fileName = 'prd.js'

const conf = require(`./envs/${fileName}`) // eslint-disable-line

module.exports = conf
