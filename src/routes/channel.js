/**
 * @description 路由 channel
 * @author 双越
 */

const router = require('koa-router')()

// 中间件
const loginCheck = require('../middlewares/loginCheck')
const genValidator = require('../middlewares/genValidator')
const channelSchema = require('../validator/channel')

// controller
const {
    createChannel,
    deleteChannel,
    updateChannelName,
    getWorkChannels,
} = require('../controller/channel/index')

// 路由前缀
router.prefix('/api/channel')

// 创建渠道
router.post('/', loginCheck, genValidator(channelSchema), async ctx => {
    const res = await createChannel(ctx.request.body)
    ctx.body = res
})

// 删除渠道
router.delete('/:id', loginCheck, async ctx => {
    const { id } = ctx.params
    const res = await deleteChannel(id)
    ctx.body = res
})

// 更新渠道名称
router.patch('/updateName/:id', loginCheck, genValidator(channelSchema), async ctx => {
    const { id } = ctx.params
    const { name } = ctx.request.body
    const res = await updateChannelName(id, name)
    ctx.body = res
})

// 根据一个作品的所有渠道
router.get('/getWorkChannels/:workId', loginCheck, async ctx => {
    const { workId } = ctx.params
    const res = await getWorkChannels(workId)
    ctx.body = res
})

module.exports = router
