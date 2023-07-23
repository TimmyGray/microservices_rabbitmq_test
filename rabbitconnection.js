'use strict';
import amq from 'amqplib';

export const rabbitConnectionString = process.env.RABBIT_CONNECTION_STRING || 'amqp://localhost';
export const req_queue = process.env.REQ_QUEUE || 'first-queue';
export const res_queue = process.env.RES_QUEUE || 'second-queque';

export class RabbitContext {

    constructor(connection_strings, first_queue, second_queue) {

        this.req_queue = first_queue;
        this.res_queue = second_queue;
        this.connection_strings = connection_strings;
        
    }

    connection;
    channel;
    
    async createConnection() {

        this.connection = await amq.connect(this.connection_strings);
    }

    async createChannel() {

        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.req_queue, { durable: false });
        await this.channel.assertQueue(this.res_queue, { durable: false });

    }

    
}
