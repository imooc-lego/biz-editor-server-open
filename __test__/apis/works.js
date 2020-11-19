/**
 * @description works API test
 * @author 双越
 */

const { get, post, patch, del } = require('./_server')

// 随机数
const R = Math.random().toString().slice(-4)

// 临时存储作品信息
let WORK_ID = ''
const WORK_INFO = {
    title: `新建作品-${R}`,
    desc: `作品描述-${R}`,
}
const CONTENT = {
    components: [
        {
            id: '123',
            name: 'l-text',
            props: { text: 'hello', top: '0', left: '20px' },
        },
    ],
    props: { x: 100 },
    setting: { y: 200 },
}

test('创建空白作品', async () => {
    const url = '/api/works/'
    const { errno, data } = await post(url, WORK_INFO)
    expect(errno).toBe(0)

    WORK_ID = data.id
})

test('修改作品信息', async () => {
    const url = `/api/works/${WORK_ID}`
    const { errno, data } = await patch(url, {
        content: CONTENT,
    })
})

test('查询作品信息', async () => {
    const url = `/api/works/${WORK_ID}`
    const { errno, data } = await get(url)
    expect(errno).toBe(0)

    expect(data.title).toBe(WORK_INFO.title)
    expect(data.desc).toBe(WORK_INFO.desc)
    expect(data.contentId).not.toBeNull()

    expect(data.content.components).toEqual(CONTENT.components)
    expect(data.content.props).toEqual(CONTENT.props)
    expect(data.content.setting).toEqual(CONTENT.setting)
})

test('拷贝作品', async () => {
    const url = `/api/works/copy/${WORK_ID}`
    const { errno, data } = await post(url)
    expect(errno).toBe(0)
})

test('删除作品', async () => {
    const url = `/api/works/${WORK_ID}`
    const { errno, data } = await del(url)
    expect(errno).toBe(0)
})

test('恢复删除', async () => {
    const url = `/api/works/put-back/${WORK_ID}`
    const { errno, data } = await post(url)
    expect(errno).toBe(0)
})

// 转增作品，待定

test('获取自己的作品和模板', async () => {
    const url = '/api/works/'
    const { errno, data } = await get(url)
    expect(errno).toBe(0)

    const { count, list = [] } = data
    expect(count).toBeGreaterThan(0)
    expect(list.length).toBeGreaterThan(0)
})

test('发布作品', async () => {
    const url = `/api/works/publish/${WORK_ID}`
    const { errno, data } = await post(url)
    expect(errno).toBe(0)

    const { url: publishUrl } = data
    console.log('publish url: ', url)
    expect(publishUrl).not.toBeNull()
})

test('发布为模板', async () => {
    const url = `/api/works/publish-template/${WORK_ID}`
    const { errno, data } = await post(url)
    expect(errno).toBe(0)
})

test('发布后，查询作品信息', async () => {
    const url = `/api/works/${WORK_ID}`
    const { errno, data } = await get(url)
    expect(errno).toBe(0)

    expect(data.status).toBe('2')
    expect(data.isTemplate).toBe(true)
})
