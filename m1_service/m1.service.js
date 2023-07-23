'use strict'
import express from 'express';
import * as envconfig from 'dotenv';
import bodyparser from 'body-parser';
import { req_queue, res_queue, rabbitConnectionString, RabbitContext } from '../rabbitconnection.js';
import { logger_m1 } from '../logger/logger.m1.js';

logger_m1.info('Starting service...');

envconfig.config();
const port = process.env.PORT_M1 || 3001;
const host = process.env.HOST_M1 || '127.0.0.1';


const m1 = express();

m1.use(bodyparser.json());

m1.get('/',async (req, res) => {

    logger_m1.info('[GET]; Get request from client');

    try {

        logger_m1.info('[GET]; Trying to establish connection with rabbitmq...');

        let likeABody = 'hello first service';

        let rabbitContext = new RabbitContext(rabbitConnectionString, req_queue, res_queue);

        await rabbitContext.createConnection()
            .then(() => {
                logger_m1.info('[GET]; Connection established.');
            })
            .catch(e => {

                logger_m1.error(`[GET]; ${e}`);

            });

        await rabbitContext.createChannel()
            .then(() => {

                logger_m1.info('[GET]; Channel created.');

            })
            .catch(e => {

                logger_m1.error(`[GET]; ${e}`);

            });

        logger_m1.info('[GET]; Try to send content to the request queue...');

        rabbitContext.channel.sendToQueue(req_queue, Buffer.from(likeABody));

        logger_m1.info('[GET]; The content successfull sent');

        logger_m1.info('[GET}; Waiting for proccesed content from response queue...');

        rabbitContext.channel.consume(res_queue, (msg) => {

            let result = msg.content.toString();

            res.send(result);

            logger_m1.info(`[GET]; ${result} - result content sent in response`);

            rabbitContext.channel.ack(msg);
            rabbitContext.channel.close();
            rabbitContext.connection.close();

            logger_m1.info(`[GET]; Message from queue acknowledged, connection closed, channel closed. Action end.`);

        });

    } catch(error) {

        logger_m1.error(`[GET]; ${error}, send to client internal server error`);
        res.status(500).send('Internal server error');

    }

});

m1.listen(port, host, () => { logger_m1.info(`Service is listen on ${port}, host:${host}`) });

