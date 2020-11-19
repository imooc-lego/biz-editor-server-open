/**
 * @description 心跳检测
 * @author 双越
 */

const { CronJob } = require('cron')
const checkAllServers = require('./check-server')

/**
 * 开始定时任务
 * @param {string} cronTime cron 规则
 * @param {Function} onTick 回调函数
 */
function schedule(cronTime, onTick) {
    if (!cronTime) return
    if (typeof onTick !== 'function') return

    // 创建定时任务
    const c = new CronJob(
        cronTime,
        onTick,
        null, // onComplete 何时停止任务，null
        true, // 初始化之后立刻执行，否则要执行 c.start() 才能开始
        'Asia/Shanghai' // 时区，重要！！
    )

    // 进程结束时，停止定时任务
    process.on('exit', () => c.stop())
}

// 开始定时任务
function main() {
    const cronTime = '*/10 * * * *' // 每 10 分钟检查一次
    schedule(cronTime, checkAllServers)
    console.log('设置心跳检测定时任务', cronTime)
}

main()
