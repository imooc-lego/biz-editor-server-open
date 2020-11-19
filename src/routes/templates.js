/**
 * @description 模板 router
 * @author 双越
 */

const router = require('koa-router')()

// controller
const { findPublicTemplates, findOneTemplate } = require('../controller/works/findTemplate')

// 路由前缀
router.prefix('/api/templates')

// 获取公共模板
router.get('/', async ctx => {
    const { title, pageIndex, pageSize } = ctx.query
    const res = await findPublicTemplates({ title }, { pageIndex, pageSize })
    ctx.body = res
})

// 查询单个公共模板
router.get('/:id', async ctx => {
    const { id } = ctx.params
    const res = await findOneTemplate(id)
    ctx.body = res
})

module.exports = router
