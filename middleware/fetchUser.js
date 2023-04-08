const jwt = require("jsonwebtoken");
const jwtSecret = "iNoteBook";

const fetchUser = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  const authToken = req.header("auth-token");
  if (!authToken) {
    res.status(401).send({ error: "Please authenticate using valid token." });
  }
  try {
    const jwtData = jwt.verify(authToken, jwtSecret);
    req.user = jwtData.user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate using valid token." });
  }
};

module.exports = fetchUser;
