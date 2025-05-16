import * as Joi from 'joi';

export const likeSchema = Joi.object({
  userId: Joi.number().required().messages({
    'number.base': 'userId must be a number',
    'any.required': 'userId is required',
  }),
  postId: Joi.number().required().messages({
    'number.base': 'postId must be a number',
    'any.required': 'postId is required',
  }),
});