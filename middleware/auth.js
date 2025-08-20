const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(400).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
    
  } else {
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
