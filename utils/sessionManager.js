const { verifyJWT } = require("./token");

const checkRole = (sysRole) => {
  return (req, res, next) => {
    const { access_token } = req.headers || "";
    if (!access_token) throw new Error("Access token iS REQUIRED");
    const { data } = verifyJWT(access_token);
    const isValidRole = sysRole.some((role) => data.roles.includes(role));
    if (!isValidRole) throw new Error("Permission Denied");
    next();
  };
};

module.exports = { checkRole };
