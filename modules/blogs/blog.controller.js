const BlogModel = require("./blog.model");
const { generateSlug } = require("../../utils/slugify");

// create
const create = (payload) => {
  payload.slug = generateSlug(payload.title);
  return BlogModel.create(payload);
};

//read
const getAll = () => {
  return BlogModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "result",
      },
    },
    {
      $unwind: {
        path: "$result",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        _id: 0,
        content: 1,
        slug: 1,
        tags: 1,
        author: 0,
        words: 1,
        status: 1,
        author: "$result.name",
      },
    },
  ]);
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
