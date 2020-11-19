/**
 * @description utils test
 * @author 双越
 */

const { getSortedObjStr } = require('../src/utils/util')
const { jwtVerify, jwtSign } = require('../src/utils/jwt')
const doCrypto = require('../src/utils/cryp')
const genPassword = require('../src/utils/genPassword')

test('将 obj 变为 string ，根据 key 排序', () => {
    const obj = { a: 10, d: 40, c: 30, b: 20 }
    const str = getSortedObjStr(obj)
    expect(str).toBe('a=10&b=20&c=30&d=40')
})

test('JWT 签名和验证', async () => {
    const userInfo = { username: 'imooc-lego', nickName: '慕课乐高' }
    const token = jwtSign(userInfo)
    const authToken = `Bearer ${token}`
    const res = await jwtVerify(authToken)

    expect(res.username).toBe('imooc-lego')
    expect(res.nickName).toBe('慕课乐高')
})

test('加密算法', () => {
    expect(doCrypto('abc')).toBe('dfcab4afe9e8b25d53c113b6deb5f429')
})

test('生成密码', () => {
    expect(genPassword().length).toBe(8)
})
