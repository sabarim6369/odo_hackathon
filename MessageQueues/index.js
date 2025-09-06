const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function startWorker() {
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  const queue = 'emailQueue';
  await channel.assertQueue(queue, { durable: true });

  console.log("👷 Worker waiting for messages...");

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const { buyerEmail, buyerName, ownerEmail, ownerName, items, totalPrice } = JSON.parse(msg.content.toString());
    console.log("📥 Received purchase job:", buyerEmail);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    const buyerHtml = `
      <div style="font-family:Arial; max-width:600px; margin:auto; padding:20px; background:#fff; border-radius:8px;">
        <h2 style="color:#4CAF50;">Thank you for your purchase, ${buyerName}!</h2>
        <ul>${items.map(i => `<li><img src="${i.image}" width="50"/> ${i.name} - Qty: ${i.quantity} - $${i.price}</li>`).join('')}</ul>
        <p><strong>Total: $${totalPrice}</strong></p>
      </div>
    `;

    const ownerHtml = `
      <div style="font-family:Arial; max-width:600px; margin:auto; padding:20px; background:#fff; border-radius:8px;">
        <h2 style="color:#FF5722;">New Order Received!</h2>
        <p>${buyerName} purchased your products:</p>
        <ul>${items.map(i => `<li><img src="${i.image}" width="50"/> ${i.name} - Qty: ${i.quantity} - $${i.price}</li>`).join('')}</ul>
        <p><strong>Total Amount: $${totalPrice}</strong></p>
      </div>
    `;

    try {
      await transporter.sendMail({ from: process.env.MAIL_USER, to: buyerEmail, subject: "Purchase Confirmation", html: buyerHtml });
      await transporter.sendMail({ from: process.env.MAIL_USER, to: ownerEmail, subject: "New Order Received", html: ownerHtml });
      channel.ack(msg);
      console.log("✅ Emails sent to buyer and owner.");
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      channel.nack(msg);
    }
  }, { noAck: false });
}

startWorker().catch(console.error);
