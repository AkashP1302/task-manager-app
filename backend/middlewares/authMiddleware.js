const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redisClient");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token in Redis
    const storedToken = await redisClient.get(decoded.id);
    if (storedToken !== token) {
      return res.status(403).json({ message: "Invalid session" });
    }

    req.user = { _id: decoded.id };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = protect;
