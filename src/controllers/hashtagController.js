import { hashtagRepository } from "../repositories/hashtagRepository.js";




export async function getHashtagPost(request, response) {
    
    const hashtag = request.params.hashtag;
    const { rows: hashtagPosts } = await hashtagRepository.getPostsByHashtags(hashtag);
    response.status(200).send(hashtagPosts);
}