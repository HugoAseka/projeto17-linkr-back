import joi from 'joi';

export const signUpSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    username: joi.string().required(),
    profilePhoto: joi.string().regex(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i
    ).required()
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});