/**
 * @description 创建作品
 * @author 双越
 */

const { v4: uuidV4 } = require('uuid')
const { createWorkService, findOneWorkService, updateWorkService } = require('../../service/works')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const {
    createWorksDbErrorFailInfo,
    createWorksFailInfo,
    forceOffLineFailInfo,
} = require('../../res-model/failInfo/index')
const { mailAlarm } = require('../../alarm/index')

/**
 * 创建作品
 * @param {string} author 作者 username
 * @param {object} data 作品数据
 * @param {object} content 作品内容（复制作品时，会传入）
 */
async function createWorks(author, data = {}, content = {}) {
    const { title } = data
    if (!title) {
        // 标题不能为空
        return new ErrorRes(createWorksFailInfo, '标题不能为空')
    }

    // uuidV4() 生成的格式如 'bc5af863-dd15-4bd9-adbe-37ea1e6450ce'
    // uuid 要用于拼接作品发布后的 url ，url 太长会导致二维码混乱。所以，只取 uuid 前几位即可。
    // uuid 太短，重复了怎么办？—— 可参考发布作品，生成 url 时的代码逻辑和注释。
    const uuid = uuidV4().slice(0, 4)
    try {
        const newWork = await createWorkService(
            {
                // 按照 WorksModel 属性
                ...data,
                author,
                uuid,
            },
            content
        )

        // 创建成功
        return new SuccessRes(newWork)
    } catch (ex) {
        console.error('创建作品失败', ex)
        mailAlarm('创建作品失败', ex)
        return new ErrorRes(createWorksDbErrorFailInfo) // 写入数据库失败
    }
}

/**
 * 复制作品（通过模板创建，也是复制）
 * @param {string} id id
 * @param {string} author 作者 username
 */
async function copyWorks(id, author) {
    const work = await findOneWorkService({ id }) // 被复制的项目不一定是自己的，所以查询条件**不加 author**

    // 是否强制下线
    if (parseInt(work.status, 10) === 3) {
        return new ErrorRes(forceOffLineFailInfo)
    }

    const { content } = work

    // 新项目的信息，要符合 WorksModel 属性规则
    const newData = {
        title: `${work.title}-复制`,
        desc: work.desc,
        coverImg: work.coverImg,

        // 其他信息，如 isTemplate status 等，都不需要
    }

    // 创新新项目
    const res = await createWorks(author, newData, content)

    // 更新源项目的使用次数
    await updateWorkService(
        {
            copiedCount: work.copiedCount + 1,
        },
        { id }
    )

    // 返回新项目
    return res
}

module.exports = {
    createWorks,
    copyWorks,
}
