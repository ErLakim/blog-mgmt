const { verifyJWT } = require("./token");
const userModel = require("../modules/users/user.model");
const checkRole = (sysRole) => {
  return async (req, res, next) => {
    const { access_token } = req.headers || "";
    if (!access_token) throw new Error("Access token iS REQUIRED");
    const { data } = verifyJWT(access_token);
    const isValidRole = sysRole.some((role) => data.roles.includes(role));
    if (!isValidRole) throw new Error("Permission Denied");
    const {roles,email}=data;
    const user =await userModel.findOne({email});
    req.body.author= roles.includes("user")
    ? user._id.toString()
    :req.body.author;
    next();
  };
};

module.exports = { checkRole };
