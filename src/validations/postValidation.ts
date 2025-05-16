import * as Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(280).required().messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 280 characters',
  }),
  hashtags: Joi.array().items(Joi.string().max(50).messages({
    'string.max': 'Each hashtag cannot exceed 50 characters',
  })).optional(),
  userId: Joi.number().required().messages({
    'number.base': 'userId must be a number',
    'any.required': 'userId is required',
  }),
});

export const updatePostSchema = Joi.object({
  content: Joi.string().min(1).max(280).optional().messages({
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 280 characters',
  }),
  hashtags: Joi.array().items(Joi.string().max(50).messages({
    'string.max': 'Each hashtag cannot exceed 50 characters',
  })).optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});