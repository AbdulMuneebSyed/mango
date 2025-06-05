const Chapter = require("../models/Chapter");
const cacheService = require("../services/cacheService");
const { validateChapters } = require("../utils/validators");

class ChapterController {
  // GET /api/v1/chapters
  async getAllChapters(req, res) {
    try {
      const {
        class: className,
        unit,
        status,
        weakChapters,
        subject,
        page = 1,
        limit = 10,
      } = req.query;

      // Build filter object
      const filter = {};
      if (className) filter.class = className;
      if (unit) filter.unit = unit;
      if (status) filter.status = status;
      if (weakChapters !== undefined)
        filter.isWeakChapter = weakChapters === "true";
      if (subject) filter.subject = subject;

      // Generate cache key
      const cacheKey = cacheService.generateCacheKey("chapters", {
        ...filter,
        page,
        limit,
      });

      // Check cache first
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return res.json({
          status: "success",
          cached: true,
          ...cachedData,
        });
      }

      // Calculate pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Get total count and chapters
      const [total, chapters] = await Promise.all([
        Chapter.countDocuments(filter),
        Chapter.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      ]);

      const result = {
        data: chapters,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      };

      // Cache the result for 1 hour
      await cacheService.set(cacheKey, result, 3600);

      res.json({
        status: "success",
        cached: false,
        ...result,
      });
    } catch (error) {
      console.error("Get all chapters error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch chapters",
      });
    }
  }

  // GET /api/v1/chapters/:id
  async getChapterById(req, res) {
    try {
      const { id } = req.params;

      const chapter = await Chapter.findById(id);
      if (!chapter) {
        return res.status(404).json({
          status: "error",
          message: "Chapter not found",
        });
      }

      res.json({
        status: "success",
        data: chapter,
      });
    } catch (error) {
      console.error("Get chapter by ID error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          status: "error",
          message: "Invalid chapter ID format",
        });
      }
      res.status(500).json({
        status: "error",
        message: "Failed to fetch chapter",
      });
    }
  }

  // POST /api/v1/chapters
  async uploadChapters(req, res) {
    try {
      let chaptersData;

      // Handle both file upload and direct JSON data
      if (req.file) {
        // File upload
        const fileContent = req.file.buffer.toString("utf8");
        chaptersData = JSON.parse(fileContent);
      } else if (req.body.chapters) {
        // Direct JSON data
        chaptersData = req.body.chapters;
      } else {
        return res.status(400).json({
          status: "error",
          message:
            "No chapters data provided. Send either a JSON file or chapters array in request body.",
        });
      }

      // Ensure chaptersData is an array
      if (!Array.isArray(chaptersData)) {
        return res.status(400).json({
          status: "error",
          message: "Chapters data must be an array",
        });
      }

      // Validate chapters
      const { validChapters, invalidChapters } = validateChapters(chaptersData);

      // Insert valid chapters
      let insertedChapters = [];
      if (validChapters.length > 0) {
        insertedChapters = await Chapter.insertMany(validChapters, {
          ordered: false, // Continue inserting even if some fail
        });

        // Invalidate cache
        await cacheService.invalidatePattern("chapters:*");
      }

      res.status(201).json({
        status: "success",
        message: `Successfully uploaded ${insertedChapters.length} chapters`,
        data: {
          inserted: insertedChapters.length,
          failed: invalidChapters.length,
          insertedChapters,
          failedChapters: invalidChapters,
        },
      });
    } catch (error) {
      console.error("Upload chapters error:", error);

      if (error.name === "SyntaxError") {
        return res.status(400).json({
          status: "error",
          message: "Invalid JSON format",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Failed to upload chapters",
      });
    }
  }
}

module.exports = new ChapterController();
