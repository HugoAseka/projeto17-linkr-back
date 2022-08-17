import joi from 'joi';

export const followSchema = joi.object({
    friendId: joi.number().required()
});