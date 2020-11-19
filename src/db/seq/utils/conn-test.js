/**
 * @description 数据量连接测试
 * @author 双越
 */

const seq = require('../seq')

// 测试连接
seq.authenticate()
    .then(() => {
        console.log('ok')
    })
    .catch(() => {
        console.log('fail')
    })
    .finally(() => {
        process.exit()
    })
