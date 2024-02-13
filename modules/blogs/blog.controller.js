const BlogModel = require("./blog.model");

// create
const create = (payload) => {
  return BlogModel.create(payload);
};

//read
const getAll = () => {
  return BlogModel.find();
};

const getById = (_id) => {
  return BlogModel.findOne({ _id });
};
//update
const updateById = (_id, payload) => {
  return BlogModel.updateOne({ _id }, payload);
};
//delete
const deleteById = (_id) => {
  return BlogModel.deleteOne({ _id });
};

module.exports = { create, getAll, getById, updateById, deleteById };
