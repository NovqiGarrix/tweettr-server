import { Chat, SearchData, SearchResponse } from "../types";
import { ServiceExeption } from "../exeptions/service.exeption";

class Twitter {

    private static instance: Twitter;
    private fetchOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    }

    private constructor() {
        if (!process.env.TWITTER_BEARER_TOKEN) throw new Error("Missing TWITTER_BEARER_TOKEN from env variables");
    }

    public static getInstance(): Twitter {
        if (!this.instance) this.instance = new Twitter();
        return this.instance;
    }

    async getReplies(tweetId: string, nextToken?: string, maxResults = 10) {

        const urlOfURL = new URL('https://api.twitter.com/2/tweets/search/recent')
        urlOfURL.searchParams.append('query', `in_reply_to_tweet_id:${tweetId}`);
        urlOfURL.searchParams.append('expansions', 'in_reply_to_user_id');
        urlOfURL.searchParams.append('user.fields', 'username,name');
        urlOfURL.searchParams.append('tweet.fields', 'author_id');
        urlOfURL.searchParams.append('max_results', maxResults.toString());

        if (nextToken) {
            urlOfURL.searchParams.append('next_token', nextToken);
        }

        const resp = await fetch(urlOfURL, this.fetchOptions);
        const data = (await resp.json()) as SearchResponse;

        if (!resp.ok) {
            throw new ServiceExeption({
                code: resp.status,
                // @ts-ignore
                error: data.detail,
                status: resp.statusText
            });
        }

        const parentTweetResp = await fetch(`https://api.twitter.com/2/tweets/${tweetId}`, this.fetchOptions);
        const parentTweetData = await parentTweetResp.json();

        const parentTweet: Chat = {
            user: data.includes.users[0],
            tweet: parentTweetData.data.text
        }

        const replies: Array<Chat> = await Promise.all(
            data.data.map(async (d: SearchData) => {

                // Fetch the user data
                const resp = await fetch(`https://api.twitter.com/2/users/${d.author_id}`, this.fetchOptions);
                const { data } = await resp.json();

                const chat: Chat = {
                    tweet: d.text,
                    user: data
                }

                return chat;

            })
        );

        replies.unshift(parentTweet);
        return {
            conversation: replies,
            ...(data.meta.next_token ? { nextToken: data.meta.next_token } : {})
        }

    }

    async isAReply(tweetId: string): Promise<boolean> {

        const urlOfURL = new URL(`https://api.twitter.com/2/tweets/${tweetId}`);
        urlOfURL.searchParams.append('expansions', 'in_reply_to_user_id');

        const resp = await fetch(urlOfURL, this.fetchOptions);
        const { data } = await resp.json();

        return !!data.in_reply_to_user_id;

    }

}

const twitter = Twitter.getInstance();
export default twitter;