import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect } from 'vitest';
import extractTweet from './extractTweet';

describe("Extract Tweet Unit Test", () => {

    it("Should extract all tweet replies from a tweet reply", async () => {

        const results = await extractTweet('https://twitter.com/jherr/status/1628943359640494085');

        for (const result of results) {
            expect(result).toEqual(
                expect.objectContaining({
                    user: expect.objectContaining({
                        name: expect.any(String),
                        username: expect.any(String),
                    }),
                    tweet: expect.any(String),
                })
            )

        }


    }, 30000);

    it("Should returns an array of Chat from tweet parent", async () => {

        const results = await extractTweet('https://twitter.com/GuptaSayujya/status/1629810641770016769?s=20');
        const PARENT_TWEET_LENGTH = 1;

        expect(results.length).toBe(10 + PARENT_TWEET_LENGTH);

        for (const result of results) {
            expect(result).toEqual(
                expect.objectContaining({
                    user: expect.objectContaining({
                        name: expect.any(String),
                        username: expect.any(String),
                    }),
                    tweet: expect.any(String),
                })
            )

        }

    })

});