import type { Request, Response } from 'express';

import extractTweet from '../utils/extractTweet';
import handleHttpError from '../utils/handleHttpError';

export const getConversation = async (req: Request, res: Response) => {

    const { tweet_url } = req.query;
    if (!tweet_url) {
        return res.status(400)
            .send({
                code: 400,
                status: "Bad Request",
                errors: [
                    {
                        error: "Missing tweet_url in query params",
                        message: "Please provide a valid tweet_url",
                        path: "query_param"
                    }
                ]
            })
    }

    if (typeof tweet_url !== "string") {
        return res.status(400)
            .send({
                code: 400,
                status: "Bad Request",
                errors: [
                    {
                        error: "Invalid tweet_url in query params",
                        message: "Please provide a valid tweet_url",
                        path: "query_param"
                    }
                ]
            })
    }

    try {

        const conversations = await extractTweet(tweet_url);

        return res.status(200)
            .send({
                code: 200,
                status: "OK",
                data: conversations,
                meta: {
                    ...(conversations.nextToken ? { next_token: conversations.nextToken } : {})
                }
            })

    } catch (error) {
        return handleHttpError(res, error);
    }

}