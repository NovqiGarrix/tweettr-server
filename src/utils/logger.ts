import dayjs from 'dayjs';
import winston from 'winston';

const logger = winston.createLogger({
    level: "debug",
    transports: new winston.transports.Console(),
    format: winston.format.printf((info) => `${dayjs().format("MMMM D, YYYY h:mm:ss A")} | [${info.level.toUpperCase()}]: ${info.message}`),
})

export default logger