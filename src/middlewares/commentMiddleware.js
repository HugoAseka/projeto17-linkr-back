import commentsSchema from "../schemas/commentsSchema.js";

export async function commentValidation(req, res, next) {
    const validate =  commentsSchema.validate(req.body);
    if(validate.error) {
        return res.status(422).send(validate.error.details[0].message);
    }
    next();
}
