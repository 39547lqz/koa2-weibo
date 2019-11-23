/**
 * @description 数据格式化
 * @author lqz
 */

/**
 * 用户默认头像
 * @param obj
 * @returns {{picture}|*}
 * @private
 */
function _formatUserPicture(obj) {
    if (obj.picture == null){
        obj.picture = 'https://dwz.cn/rnTnftZs'
    }
    return obj
}

/**
 * 格式化用户信息
 * @param list
 */
function formatUser(list) {
    if (list == null){
        return list
    }

    if (list instanceof Array){
        // 数组 用户列表
        return list.map(_formatUserPicture)
    }

    // 单个对象
    return _formatUserPicture(list)
}

module.exports = {
  formatUser
};