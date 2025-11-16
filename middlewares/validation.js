const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error("Invalid URL format");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error("Invalid email format");
};

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "username" field is 2',
      "string.max": 'The maximum length of the "username" field is 30',
      "string.empty": 'The "username" field must be filled in',
    }),

    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),

    password: Joi.string().required(),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),

    password: Joi.string().required(),
  }),
});

module.exports.validateSaveArticle = celebrate({
  body: Joi.object().keys({
    author: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "author" field is 2',
      "string.max": 'The maximum length of the "author" field is 30',
      "string.empty": 'The "author" field must be filled in',
    }),

    title: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "title" field is 2',
      "string.max": 'The maximum length of the "title" field is 30',
      "string.empty": 'The "title" field must be filled in',
    }),

    description: Joi.string().required().min(5).messages({
      "string.min": 'The minimum length of the "description" field is 2',
      "string.empty": 'The "description" field must be filled in',
    }),

    url: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "url" field must be filled in',
      "string.uri": 'the "url" field must be a valid url',
    }),

    urlToImage: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "urlToImage" field must be filled in',
      "string.uri": 'the "urlToImage" field must be a valid url',
    }),

    publishedAt: Joi.date().iso().required(),

    content: Joi.string().required().messages({
      "string.empty": 'The "content" field must be filled in',
    }),

    source: Joi.string().required().messages({
      "string.min": 'The minimum length of the "source" field is 2',
      "string.max": 'The maximum length of the "source" field is 30',
      "string.empty": 'The "source" field must be filled in',
    }),

    keyWord: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "keyWord" field is 2',
      "string.max": 'The maximum length of the "keyWord" field is 30',
      "string.empty": 'The "keyWord" field must be filled in',
    }),

    owner: Joi.string().hex().length(24).required(),
  }),
});

// module.exports.validateUserId = celebrate({
//   headers: Joi.object({
//     authorization: Joi.string()
//       .pattern(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
//       .required(),
//   }).unknown(true),
// });
