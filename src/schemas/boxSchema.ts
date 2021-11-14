import Joi from 'joi';

export const boxSchema = {
    body: {
        sheetSize: Joi.object({
            w: Joi.number()
                .integer()
                .positive()
                .required(),
            l: Joi.number()
                .integer()
                .positive()
                .required(),
        }).required(),
        boxSize: Joi.object({
            w: Joi.number()
                .integer()
                .positive()
                .required(),
            d: Joi.number()
                .integer()
                .positive()
                .required(),
            h: Joi.number()
                .integer()
                .positive()
                .required(),
        }).required(),
    },
};
