/* How to make */
/*

const Person = require('./models/person')
const Message = require('./models/message')

Message.belongsTo(Person, { as:'Author', foreignKey:'authorId' })
Person.hasMany(Message, { as:'Messages', foreignKey:'authorId' })


*/

const User = require('./models/user')
const Project = require('./models/project')
const JoinedHistory = require('./models/joinedHistory')

User.hasMany(Project, {as: 'CreatedProjects', foreignKey: 'OwnerAddress'})
Project.belongsTo(User, {as: 'Owner', foreignKey: 'OwnerAddress'})

JoinedHistory.belongsTo(User, {as: 'User', foreignKey: 'UserAddress'})
JoinedHistory.belongsTo(Project, {as: 'Project', foreignKey: 'PoolAddress'})
User.hasMany(JoinedHistory, {as: 'JoinedHistoryList', foreignKey: 'UserAddress'})
Project.hasMany(JoinedHistory, {as: 'JoinedHistoryList', foreignKey: 'PoolAddress'})