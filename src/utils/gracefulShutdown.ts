import logger from './logger';

export default function gracefullShutdown(callback: () => Promise<void> | void) {
    const SIGNALS = ["SIGTERM", "SIGINT"];

    for (const s of SIGNALS) {
        process.on(s, async () => {
            logger.info(`Receive signal: ${s}. Process exiting...`);

            const callbackResult = callback();

            if (callbackResult instanceof Promise) {
                return callbackResult.then(() => {
                    logger.warn('Closing process!');
                    process.exit(0);
                })
            }
        })
    }

}