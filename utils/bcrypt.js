const bycryptjs = require("bcryptjs");

const hashPassword = (password) => {
  return bycryptjs.hashSync(password, Number(process.env.SALT_ROUND));
};

const comparePassword = (password, hashPassword) => {
  return bycryptjs.compareSync(password, hashPassword);
};

module.exports = { hashPassword, comparePassword };
