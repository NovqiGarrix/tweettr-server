import p from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export default async function setupBrowser() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new',
        slowMo: 90,
        defaultViewport: {
            width: 1280,
            height: 720,
        },
        executablePath: p.executablePath()
    });

    return browser;
}