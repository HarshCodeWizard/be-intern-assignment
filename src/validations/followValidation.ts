import * as Joi from 'joi';

export const followSchema = Joi.object({
  followerId: Joi.number().required().messages({
    'number.base': 'followerId must be a number',
    'any.required': 'followerId is required',
  }),
  followedId: Joi.number().required().invalid(Joi.ref('followerId')).messages({
    'number.base': 'followedId must be a number',
    'any.required': 'followedId is required',
    'any.invalid': 'A user cannot follow themselves',
  }),
});