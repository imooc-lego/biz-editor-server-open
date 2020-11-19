/**
 * @description 修改用户信息
 * @author 双越
 */

const { updateUserInfoService } = require('../../service/users')
const {
    updateUserInfoFailInfo,
    updateUserInfoDbErrorFailInfo,
} = require('../../res-model/failInfo/index')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const { jwtSign } = require('../../utils/jwt')

/**
 * 修改用户信息
 * @param {object} curUserInfo 当前用户信息
 * @param {object} data 要修改的用户信息
 */
async function updateUserInfo(curUserInfo, data = {}) {
    const { username } = curUserInfo
    let res
    try {
        res = await updateUserInfoService(username, data)
    } catch (ex) {
        console.error('修改用户信息', ex)
        return new ErrorRes(updateUserInfoDbErrorFailInfo) // 数据库操作失败
    }

    // 修改成功
    if (res) {
        const newUserInfo = {
            ...curUserInfo,
            ...data,
        }
        delete newUserInfo.iat
        delete newUserInfo.exp
        return new SuccessRes({
            token: jwtSign(newUserInfo),
        })
    }
    // 修改失败
    return new ErrorRes(updateUserInfoFailInfo) // 失败，但数据库操作正确
}

module.exports = updateUserInfo
