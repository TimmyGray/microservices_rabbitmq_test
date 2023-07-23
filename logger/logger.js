import { createLogger, format, transports } from 'winston';


export const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console(), new transports.File({ filename: 'logs/logs.log' })],
    exeptionHandlers: [new transports.File({ filename: 'logs/exeptions.log' })],
    rejectionHandlers: [new transports.File({filename:'logs/rejections.log'})]
});