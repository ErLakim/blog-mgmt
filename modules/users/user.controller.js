const UserModel = require("./user.model");

const create = (payload) => {
  return UserModel.create(payload);
};

const getAll = () => {
  return UserModel.find();
};

const getById = (_id) => {
  return UserModel.findOne({ _id });
};

const updateById = (_id, payload) => {
  return UserModel.updateOne({ _id }, payload);
};

const deleteById = (id) => {
  return UserModel.deleteOne({ _id });
};

module.exports = { create, getAll, getById, updateById, deleteById };
