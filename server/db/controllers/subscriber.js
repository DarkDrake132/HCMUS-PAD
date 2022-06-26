const Subscriber = require("../models/subcriber");
const { Op } = require("sequelize");
const sequelize = require("../connection");

require("../reference");

const {sendConfirmSubscirbeEmail} = require("../../sendgrid")

async function createSubcriber(Email) {
  const [email, created] = await Subscriber.findOrCreate({
    where: { email: Email },
    defaults: {
      email: Email,
    },
  });

  //auto send to user
  await sendConfirmSubscirbeEmail(email);

  return { email, created };
}

module.exports = {
  createSubcriber,
};
