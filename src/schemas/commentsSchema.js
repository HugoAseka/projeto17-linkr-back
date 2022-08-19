import joi from 'joi';

const commentsSchema = joi.object({
    comment: joi.string().required()
}); 

export default commentsSchema;