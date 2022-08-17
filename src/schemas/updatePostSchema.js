import joi from "joi";

export const updatePostSchema = joi.object({
  description: joi.string()
});

export default updatePostSchema;
