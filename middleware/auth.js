const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.verifyAuth = async (req, res, next) => {
  var token = req.cookies["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, msg: "No token provided." });

  jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, msg: "Failed to authenticate token." });

    res.user = decoded;
    next();
  });
};
