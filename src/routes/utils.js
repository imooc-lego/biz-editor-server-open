/**
 * @description 路由 工具类
 * @author 双越
 */

const router = require('koa-router')()

// 中间件
const loginCheck = require('../middlewares/loginCheck')

// controller
const uploadImg = require('../controller/utils/uploadImg')

// 路由前缀
router.prefix('/api/utils')

// 上传图片（form-data 形式，支持多文件上传）
router.post('/upload-img', loginCheck, async ctx => {
    const res = await uploadImg(ctx.req)
    ctx.body = res
})

module.exports = router
