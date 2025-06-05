const app = require("./src/app");
const connectDB = require("./src/config/database");
const { connectRedis } = require("./src/config/redis"); // Add this

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Connect to Redis before starting the server
connectRedis()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  });
