import * as Joi from 'joi';

export const activitySchema = Joi.object({
  userId: Joi.number().required().messages({
    'number.base': 'userId must be a number',
    'any.required': 'userId is required',
  }),
  type: Joi.string().valid('POST', 'LIKE', 'UNLIKE', 'FOLLOW', 'UNFOLLOW').required().messages({
    'string.empty': 'Type is required',
    'any.only': 'Type must be one of POST, LIKE, UNLIKE, FOLLOW, UNFOLLOW',
  }),
  targetId: Joi.number().optional().messages({
    'number.base': 'targetId must be a number',
  }),
});