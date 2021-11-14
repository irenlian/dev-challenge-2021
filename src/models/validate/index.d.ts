import Joi from 'joi';

declare namespace Models.Validate {
    export interface ValidateSchema {
        headers?: Joi.SchemaMap;
        params?: Joi.SchemaMap;
        query?: Joi.SchemaMap;
        body?: Joi.SchemaMap;
    }
}
