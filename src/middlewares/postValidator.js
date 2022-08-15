import updatePostSchema from "../schemas/updatePostSchema.js";



async function updatePostValidator(request, response, next) {
    const post = request.body;

    const validate =  updatePostSchema.validate(post);
    console.log(validate);
    if(validate.error) {
        return response.status(400).send("Campo descrição preenchido incorretamente!");
    }
    next();
}

export const postValidator = {
    updatePostValidator
};