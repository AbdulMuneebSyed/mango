const Joi = require("joi");

const chapterSchema = Joi.object({
  subject: Joi.string().trim().required(),
  chapter: Joi.string().trim().required(),
  class: Joi.string().trim().required(),
  unit: Joi.string().trim().required(),
  yearWiseQuestionCount: Joi.object()
    .pattern(Joi.string(), Joi.number().integer().min(0))
    .required(),
  questionSolved: Joi.number().integer().min(0).required(),
  status: Joi.string()
    .valid("Not Started", "In Progress", "Completed")
    .required(),
  isWeakChapter: Joi.boolean().required(),
});

const validateChapter = (chapter) => {
  return chapterSchema.validate(chapter);
};

const validateChapters = (chapters) => {
  const validChapters = [];
  const invalidChapters = [];

  chapters.forEach((chapter, index) => {
    const { error } = validateChapter(chapter);
    if (error) {
      invalidChapters.push({
        index,
        chapter,
        error: error.details[0].message,
      });
    } else {
      validChapters.push(chapter);
    }
  });

  return { validChapters, invalidChapters };
};

module.exports = { validateChapter, validateChapters };
