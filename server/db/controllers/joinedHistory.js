const Project = require('../models/project')
const JoinedHitory = require('../models/joinedHistory')
const { Op, and } = require('sequelize')
const Status = require('../../data-type/projectStatus')

require('../reference')

export async function hasJoinedHistory(_poolAddress, _userAddress) {
    const history = await JoinedHitory.findOne({ where: {
        PoolAddress: _poolAddress,
        UserAddress: _userAddress,
    } })
    return !!history
}

export async function saveJoinedHistory(_poolAddress, _userAddress) {
    await JoinedHitory.create({
        PoolAddress: _poolAddress,
        UserAddress: _userAddress,
    })
}