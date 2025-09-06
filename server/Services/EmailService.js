const amqp = require('amqplib');

async function sendEmailToQueue(emailData) {
  // Use CloudAMQP in production or localhost in dev
  const amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();

  const queue = 'emailQueue';
  await channel.assertQueue(queue, { durable: true });

  // Send message as persistent
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), { persistent: true });
  console.log("📩 Sent to queue:", emailData);

  setTimeout(() => { connection.close(); }, 500);
}

module.exports = sendEmailToQueue;
