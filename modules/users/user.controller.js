const UserModel = require("./user.model");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const { mailer } = require("../../services/mailer");

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

const register = async (payload) => {
  const { password } = payload;
  if (!password) throw new Error("Password field is missing.");
  payload.password = hashPassword(payload.password);
  const user = await UserModel.create(payload);
  if (!user) throw new Error("User registration fail.");
  const mail = await mailer(user.email);
  if (mail) return "User Registration Completed";
};

const login = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) throw new Error("Email or password Missing!");
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User Doesnot exist");
  const { password: hashPw } = user;
  const result = comparePassword(password, hashPw);
  // console.log ({result});
  if (result === undefined) {
    // Handle the case where comparePassword didn't return a valid result
    throw new Error("Error comparing passwords");
  }

  if (!result) {
    throw new Error("Email or password mismatch");
  }

  return "User logged In successfully";
};

// const resetPassword = async (payload) => {
//   const { userId, password } = payload;
//   if (!userId || !password) throw new Error("User or password missing");
//   const user = await userModel.findOne({ _id: userId });
//   if (!user) throw new Error("User not found");
//   await UserModel.updateOne(
//     { _id: user._id },
//     { password: hashPassword(password) }
//   );
//   return "Password reset succesfully.";
// };

// const changePassword = async (payload) => {
//   const { userId, oldPassword,newPassword } = payload;

// };

const getProfile = (userId) => {
  return UserModel.findOne({ _id: userId });
};

// const updateProfile = async(userId, payload) => {
//   const user= await UserModel.findOne({_id:userId});
//   if(!user) throw new Error("User not Found.");
//   await UserModel.updateOne({_id:user._id},payload);
//   return"Profile Updated Sucessfuly.;"
// };

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  register,
  login,
  getProfile,
  // updateProfile,
  // resetPassword,
  // changePassword,
};
