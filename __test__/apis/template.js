/**
 * @description template API test
 * @author 双越
 */

const { get } = require('./_server')

// 临时存储信息
let TEMP_ID = '0'

test('获取公共模板列表', async () => {
    const url = '/api/templates/'
    const { errno, data } = await get(url)
    expect(errno).toBe(0)

    const { count, list = [] } = data
    if (count > 0) {
        expect(list.length).toBeGreaterThan(0)
        TEMP_ID = list[0].id
    }
})

test('获取单个模板', async () => {
    const url = `/api/templates/${TEMP_ID}`
    const { errno, data } = await get(url)

    if (TEMP_ID === '0') {
        expect(errno).toBe(13003) // 查询失败
    } else {
        expect(errno).toBe(0) // 查询成功
    }
})
