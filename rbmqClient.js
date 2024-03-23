var amqplib = require('amqplib');

(async () => {
    const conn = await amqplib.connect('amqp://localhost:5673');
  
    const ch1 = await conn.createChannel();
    await ch1.assertExchange("my_topic", "topic")
    const q = await ch1.assertQueue("my_queue")
    await ch1.bindQueue(q.queue, "my_topic", "topic_key")
    await ch1.close()
  
    // Sender
    const ch2 = await conn.createChannel();
    
    ch2.consume(q.queue, (msg)=> {
        console.log(String(msg.content))
    })
})();
