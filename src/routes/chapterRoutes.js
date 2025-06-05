const express = require("express");
const chapterController = require("../controllers/chapterController");
const { authenticateAdmin, adminLogin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Admin login route
router.post("/auth/login", adminLogin);

// Chapter routes
router.get("/chapters", chapterController.getAllChapters);
router.get("/chapters/:id", chapterController.getChapterById);
router.post(
  "/chapters",
  authenticateAdmin,
  upload.single("file"),
  chapterController.uploadChapters
);

module.exports = router;
