/**
 * @description  用户关系 service
 * @author lqz
 */

const {UserRelation, User} = require('../db/model/index');
const { formatUser } = require('./_format');

/**
 * 获取关注该用户的用户列表，即该用户的粉丝
 * @param followerId
 * @returns {Promise<void>}
 */
async function getUsersByFollower(followerId) {
    const result = await User.findAndCountAll({
        attributes : ['id', 'userName', 'nickName', 'picture'],
        order : [
            ['id', 'desc']
        ],
        include : [
            {
                model : UserRelation,
                where : {
                    followerId
                }
            }
        ]
    });
    let userList = result.rows.map(row => row.dataValues);
    userList = formatUser(userList);
    return {
        count : result.count,
        userList
    }
}

module.exports = {
  getUsersByFollower
};