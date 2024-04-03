const UserToken = require("../models/UserToken");

exports.Auth = (req, res, next) => {
  const users = UserToken.all();
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validUser = users.find((user) => user.token === authToken);
  if (!validUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
