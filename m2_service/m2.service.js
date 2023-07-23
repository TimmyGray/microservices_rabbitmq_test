'use strict'
import express from 'express';
import * as envconfig from 'dotenv';
import bodyparser from 'body-parser';
import { rabbitConnectionString, req_queue, res_queue, RabbitContext } from '../rabbitconnection.js';
import { logger_m2 } from '../logger/logger.m2.js';

logger_m2.info('Starting service...');

envconfig.config();
const port = process.env.PORT_M2 || 3002;
const host = process.env.HOST_M2 || 'localhost';

const m2 = express();

m2.use(bodyparser.json());

let rabbitContext = new RabbitContext(rabbitConnectionString, req_queue, res_queue);

function makeSomeActions(msg) {

    logger_m2.info('Make Some Actions...');

    let addiction = 'hello second service';

    logger_m2.info('Successfull');

    return msg +' '+ addiction;

}

logger_m2.info('Try to establish connection with rabbitmq...');

await rabbitContext.createConnection()
    .then(() => {

        logger_m2.info('Connection established, ');

    })
    .catch(e => {

        logger_m2.error(e);

    });

logger_m2.info('Try to create channel...');

rabbitContext.createChannel()
    .then(() => {

        logger_m2.info('Channel created, waiting for content from req queue...');

        rabbitContext.channel.consume(req_queue, (msg) => {

            logger_m2.info('Making actions with content...');

            let result = makeSomeActions(msg.content.toString());

            logger_m2.info(`${result} - result of making actions`);

            rabbitContext.channel.ack(msg);

            rabbitContext.channel.sendToQueue(res_queue, Buffer.from(result));

            logger_m2.info('Message acknowledged, result sent to the response queue');

        })

    })
    .catch(e => {

        logger_m2.error(e);

    });

m2.listen(port,host,() => { logger_m2.info(`Service is listen on ${port}, host:${host}`) });

