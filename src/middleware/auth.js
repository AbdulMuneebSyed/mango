const jwt = require("jsonwebtoken");

const createAdminToken = () => {
  return jwt.sign(
    {
      email: process.env.ADMIN_EMAIL,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Admin privileges required.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token.",
    });
  }
};

// Login endpoint for getting admin token
const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = createAdminToken();
    res.json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } else {
    res.status(401).json({
      status: "error",
      message: "Invalid credentials",
    });
  }
};

module.exports = { authenticateAdmin, adminLogin };
