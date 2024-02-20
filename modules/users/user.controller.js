const UserModel = require("./user.model");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const { mailer } = require("../../services/mailer");
const { signJWT, generatesSixDigitToken } = require("../../utils/token");
const userModel = require("./user.model");

const create = (payload) => {
  return UserModel.create(payload);
};

const list = async (search, page = 1, limit = 3) => {
  const query = [];
  if (search?.name) {
    query.push({
      $match: {
        name: new RegExp(search.name, "gi"),
      },
    });
  }
  if (search?.role) {
    query.push({
      $match: {
        roles: [search.role],
      },
    });
  }
  //sorting
  query.push(
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          {
            $limit: +limit,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["", 0], // Corrected syntax here
        },
      },
    },
    {
      $project: {
        total: 1,
        data: 1,
      },
    },
    {
      $project: {
        "data.password": 0,
      },
    }
  );
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
  const mail = await mailer(
    user.email,
    "User Registration✔",
    "User Registration Completed"
  );
  if (mail) return "User Registration Completed";
};

const login = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) throw new Error("Email or password Missing!");
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new Error("User Doesnot exist");
  const { password: hashPw } = user;
  const result = comparePassword(password, hashPw);
  // console.log ({result});
  // if (result === undefined) {
  //   // Handle the case where comparePassword didn't return a valid result
  //   throw new Error("Error comparing passwords");
  // }

  if (!result) throw new Error("Email or password mismatch");

  const userPayload = { name: user.name, email: user.email, roles: user.roles };
  const token = signJWT(userPayload);
  return token;
};

const generateFPToken = async (payload) => {
  const { email } = payload;
  if (!email) throw new Error("Email not found.");
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User doesnot exist");

  const token = generatesSixDigitToken();
  await UserModel.updateOne({ _id: user._id }, { token });
  await mailer(email, "Forget Password Token", `Your reset Token is ${token}`);
  return "Token is sent to email.";
};

const verifyFPToken = async (payload) => {
  const { token, email, password } = payload;
  if (!token || !email || !password) throw new Error("Something is missing");
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User doesnot exist");
  if (token !== user.token) throw new Error("Invalid Token");

  // const newHashPw = hashPassword(password);
  const updatedUser = await UserModel.updateOne(
    { email },
    { password: hashPassword(password), token: "" }
  );
  if (!updatedUser) throw new Error("Password update Failed");
  return "Password changed sucessfully";
};

const resetPassword = async (payload) => {
  const { userId, password } = payload;
  if (!userId || !password) throw new Error("User or password missing");
  const user = await userModel.findOne({ _id: userId });
  if (!user) throw new Error("User not found");
  await UserModel.updateOne(
    { _id: user._id },
    { password: hashPassword(password) }
  );
  return "Password reset succesfully.";
};

const changePassword = async (payload) => {
  const { userId, oldPassword, newPassword } = payload;
  if (!oldPassword || !newPassword || !userId)
    throw new Error("Something is missing");
  const user = await userModel.findOne({ _id: userId }).select("+password");
  if (!user) throw new Error("User not found");
  const isValidOldPw = comparePassword(oldPassword, user.password);
  if (!isValidOldPw) throw new Error("Password didn't match");
  await UserModel.updateOne(
    { _id: user._id },
    { password: hashPassword(newPassword) }
  );
  return "Password Changed Sucessfully";
};

const getProfile = (userId) => {
  return UserModel.findOne({ _id: userId });
};

const updateProfile = async (userId, payload) => {
  const user = await UserModel.findOne({ _id: userId });
  if (!user) throw new Error("User not Found.");
  await UserModel.updateOne({ _id: user._id }, payload);
  return "Profile Updated Sucessfuly.;";
};

module.exports = {
  create,
  list,
  getById,
  updateById,
  deleteById,
  register,
  login,
  generateFPToken,
  verifyFPToken,
  getProfile,
  updateProfile,
  resetPassword,
  changePassword,
};
