const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  name: String,
  email: { type: String, required: true , unique: true},
  password:{type: String, required: true, select: false},
  phone: Number,
  roles:{
    type:[String],
    enum:["admin","user"],
    default:"user",
    required: true,
  },
  token: String,
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
module.exports = new model("User", userSchema);
