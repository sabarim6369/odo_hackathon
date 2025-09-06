const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function startWorker() {
  const connection = await amqp.connect('amqps://kssuhgsu:eQ6vQE9wyzT3lU3QVz4KKyVoRGx4UZrP@jaragua.lmq.cloudamqp.com/kssuhgsu');
  const channel = await connection.createChannel();

  const queue = 'emailQueue';
  await channel.assertQueue(queue, { durable: true });

  console.log("👷 Worker waiting for messages...");

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { to, subject, text } = JSON.parse(msg.content.toString());
      console.log("📥 Received email job:", to);

      // Setup Nodemailer
      let transporter = nodemailer.createTransport({
        service: "gmail", // or smtp config
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      try {
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to,
          subject,
          text
        });
        console.log("✅ Email sent:", to);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Email failed:", err);
        channel.nack(msg); // requeue message
      }
    }
  }, { noAck: false });
}

startWorker().catch(console.error);
