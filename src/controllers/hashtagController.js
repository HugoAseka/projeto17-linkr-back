import { hashtagRepository } from "../repositories/hashtagRepository.js";


export async function getHashtagPost(request, response) {
    
    const hashtag = request.params.hashtag;
    console.log(hashtag);
    const  hashtagPosts  = await hashtagRepository.getPostsByHashtags(hashtag);
    return response.status(200).send(hashtagPosts);
}

export async function getHashtagRanking(request, response) {
    
    const { rows: hashtagRanking } = await hashtagRepository.getHashtagRank();
    return response.status(200).send(hashtagRanking);
}