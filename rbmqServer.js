const express = require("express");
const axios = require("axios");

var amqplib = require('amqplib');

const app = express();
const port = process.env.PORT || 3001;

const task = {
  taskId:1234
};

function newDoSomething(cha, exchange, key, msg) {
    return async function doSomething(req, res) {
        await cha.publish(exchange, key, Buffer.from(msg));

        res.json({
            status: 'ok'
        })
    }
}

(async () => {
    const conn = await amqplib.connect('amqp://localhost:5673');
  
    const ch1 = await conn.createChannel();
    await ch1.assertExchange("my_topic", "topic")
    const q = await ch1.assertQueue("my_queue")
    await ch1.bindQueue(q.queue, "my_topic", "topic_key")
    await ch1.close()
  
    // Sender
    const ch2 = await conn.createChannel();
  
    app.get("/do", newDoSomething(ch2, "my_topic", "topic_key", "hello"));

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
})();
