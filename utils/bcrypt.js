const bcrypt = require('bcryptjs');

const saltRounds = 8;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

module.exports = {
  hashPassword,
  comparePassword
};