import Joi from 'joi';

export const createPublishedWeekDto = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});
