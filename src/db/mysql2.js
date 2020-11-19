/**
 * @description mysql2 连接测试（暂时不用，先保留）
 * @author 双越
 */

const mysql = require('mysql2/promise')
const { mysqlConf } = require('../config/index')

async function testMysqlConn() {
    const connection = await mysql.createConnection(mysqlConf)
    const [rows] = await connection.execute('select now();')
    return rows
}

// ;(async () => {
//     const rows = await testMysqlConn()
//     console.log(rows)
// })()

module.exports = testMysqlConn
