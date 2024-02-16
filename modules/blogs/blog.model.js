const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const blogSchema = new Schema({
  title: { type: String, required: [true, "Title is Missing!"] },
  tags: [String],
  slug:{type: String, required : true, unique:true},
  content: { type: String },
  author: { type: ObjectId,ref:"User", required:true },
  words: { type: Number, default: 0 },
  status: { type: String, enum: ["published", "draft"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = new model("Blog", blogSchema);
