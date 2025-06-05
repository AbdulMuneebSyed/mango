const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    chapter: {
      type: String,
      required: [true, "Chapter name is required"],
      trim: true,
    },
    class: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    yearWiseQuestionCount: {
      type: Map,
      of: Number,
      required: [true, "Year wise question count is required"],
    },
    questionSolved: {
      type: Number,
      required: [true, "Questions solved count is required"],
      min: [0, "Questions solved cannot be negative"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Not Started", "In Progress", "Completed"],
    },
    isWeakChapter: {
      type: Boolean,
      required: [true, "Weak chapter flag is required"],
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create compound index for better query performance
chapterSchema.index({ subject: 1, class: 1, unit: 1 });
chapterSchema.index({ status: 1 });
chapterSchema.index({ isWeakChapter: 1 });

module.exports = mongoose.model("Chapter", chapterSchema);
