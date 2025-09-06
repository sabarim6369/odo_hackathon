const amqp = require('amqplib');

async function sendEmailToQueue(emailData) {
  const connection = await amqp.connect('amqp://localhost'); // or your RabbitMQ cloud URL
  const channel = await connection.createChannel();

  const queue = 'emailQueue';
  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
    persistent: true
  });

  console.log("📩 Sent to queue:", emailData);

  setTimeout(() => { connection.close(); }, 500);
}

module.exports = sendEmailToQueue;