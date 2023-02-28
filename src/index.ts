import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

import logger from './utils/logger';
import requestLogger from './middlewares/requestLogger.middleware';

import v1 from './routes/v1';
import gracefullShutdown from './utils/gracefulShutdown';

const ORIGINS = process.env.ORIGINS;
if (!ORIGINS) throw new Error("Please set the origin URLs");

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) throw new Error('Missing BASE_URL in env variables');

const app = express();
const PORT = +(process.env.PORT || 4002);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: JSON.parse(ORIGINS) }));

app.use(requestLogger);

app.use("/api/v1", v1);

const server = app.listen(PORT, () => {

    logger.info(`PORT: ${PORT}`);
    logger.info(`Server is up and running at ${process.env.BASE_URL}`);

});

gracefullShutdown(() => {
    server.close();
    logger.info('Server is shutting down');
    process.exit(0);
})