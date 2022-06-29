const User = require("../models/user");

require("../reference");

async function getUser(address) {
  const user = await User.findOne({ where: { Address: address } });

  return user;
}

async function createUser({ Address, Email }) {
    const [user, created] = await User.findOrCreate({
      where: { Address },
      defaults: {
        Email,
      },
    });
    
    return { user, created };
  }
  
async function hasKYC(address) {
  const user = await getUser(address);
  if (user) {
      return true
  }
  return false
  // await createUser({ Address: address, Email: "test@hcmus.com" });
  // return true;
}

async function deleteUser(address) {
    const user = await getUser(address)

    if (!user) {
        return { deleted: false }
    }

    await user.destroy()

    return { deleted: true }
}

module.exports = {
  getUser,
  createUser,
  hasKYC,
  deleteUser,
};
