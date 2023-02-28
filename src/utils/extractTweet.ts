import type { Browser } from 'puppeteer';

import type { Chat } from '../types';
import { ServiceExeption } from '../exeptions/service.exeption';

import isUrl from './isUrl';
import twitter from './twitter';
import setupBrowser from "./setupBrowser";

export default async function extractTweet(tweetUrl: string): Promise<{ conversation: Array<Chat>, nextToken?: string }> {

    if (!isUrl(tweetUrl)) {
        throw new ServiceExeption({
            code: 400,
            error: 'Invalid tweet URL',
            status: 'Bad Request'
        });
    }

    let browser: Browser | undefined = undefined;

    try {

        const URLofTweetUrl = new URL(tweetUrl);
        if (URLofTweetUrl.searchParams.get('s')) {
            URLofTweetUrl.searchParams.delete('s');
        }

        const tweetId = URLofTweetUrl.toString().split('/').pop()!;
        if (!tweetId) throw new Error('Invalid tweet URL');

        const isTweetAReply = await twitter.isAReply(tweetId);
        if (!isTweetAReply) {
            const replies = await twitter.getReplies(tweetId);
            return replies;
        }

        browser = await setupBrowser();
        const page = (await browser.pages())[0];

        await page.goto(tweetUrl, { waitUntil: "networkidle2" });

        const showRepliesButton = await page.$('.css-18t94o4 css-1dbjc4n r-16y2uox r-19u6a5r r-1ny4l3l r-m2pi6t r-o7ynqc r-6416eg'.replaceAll(' ', '.'));
        if (showRepliesButton) {
            await showRepliesButton.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }));

            console.log("Clicking replies button...");
            await showRepliesButton.click();
            await page.waitForNetworkIdle();
        }

        console.log("Extracting chats...");
        // This method only works for tweet inside of a thread (selected tweet)
        const chats = await page.evaluate(() => {
            const chats = Array.from(document.querySelectorAll('[data-testid="tweetText"]'), (el) => {
                if (el.parentElement?.querySelector('[dir=ltr]')) return;

                const parentTweet = el.parentElement
                const parentOfParentTweet = parentTweet?.parentElement
                const siblingOfParentOfParentTweet = parentOfParentTweet?.previousElementSibling;


                const tweet = el.querySelector('span')?.textContent
                let name = siblingOfParentOfParentTweet?.querySelector('a')?.innerText;
                let username = siblingOfParentOfParentTweet?.querySelector('.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t')?.textContent?.split('·')[0];

                // It has different style, if the tweet is selected
                // And the username will be undefined
                if (!username) {
                    name = document.querySelectorAll('.css-1dbjc4n r-1wbh5a2 r-dnmrzs'.replaceAll(' ', '.'))[15].textContent!;
                    username = document.querySelectorAll('.css-1dbjc4n r-1wbh5a2 r-dnmrzs'.replaceAll(' ', '.'))[16].textContent!;
                }

                return {
                    user: { name, username },
                    tweet
                }

            }).filter(Boolean) as Array<Chat>;

            return chats;
        });

        return { conversation: chats }

    } catch (error) {
        if (error instanceof ServiceExeption) {
            throw error;
        }

        console.log(`Error while extracting tweet: ${error}`);
        throw ServiceExeption.createInternalError();
    } finally {
        if (browser) {
            await browser.close();
        }
    }

}