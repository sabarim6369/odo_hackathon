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
      const data = JSON.parse(msg.content.toString());
 let buyerHtml = "";
  let ownerHtml = "";
  if (data.type === "purchase") {
    buyerHtml= `
<div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:30px; background:#f9f9f9; border-radius:10px; border:1px solid #ddd;">
  <h1 style="color:#4CAF50; text-align:center;">🎉 Thank You for Your Purchase, ${buyerName}!</h1>
  
  <p style="font-size:16px;">We are thrilled you chose our store! Your order has been successfully placed. Below are the details of your purchase:</p>

  <table style="width:100%; border-collapse:collapse; margin-top:20px;">
    <thead>
      <tr style="background:#4CAF50; color:#fff;">
        <th style="padding:10px; text-align:left;">Product</th>
        <th style="padding:10px; text-align:center;">Quantity</th>
        <th style="padding:10px; text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(i => `
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px;">
            <img src="${i.image}" width="50" style="vertical-align:middle; border-radius:5px; margin-right:10px;"/> ${i.name}
          </td>
          <td style="padding:10px; text-align:center;">${i.quantity}</td>
          <td style="padding:10px; text-align:right;">$${i.price}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p style="font-size:18px; text-align:right; margin-top:20px;"><strong>Total: $${totalPrice}</strong></p>

  <p style="font-size:16px; color:#555;">Your order will be processed and shipped shortly. You will receive tracking updates via email once it’s on the way!</p>

  <p style="text-align:center; margin-top:30px;">
    <a href="https://yourstore.com/orders" style="background:#4CAF50; color:white; padding:12px 25px; text-decoration:none; border-radius:5px;">View Order Details</a>
  </p>

  <hr style="margin:40px 0; border:none; border-top:1px solid #eee;"/>
  
  <p style="font-size:14px; color:#888; text-align:center;">Thank you for trusting us! We hope you enjoy your products and come back for more! 💚</p>
</div>
`;
    ownerHtml=  `
<div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:30px; background:#fff3f0; border-radius:10px; border:1px solid #ffd0c4;">
  <h1 style="color:#FF5722; text-align:center;">📦 New Order Received!</h1>

  <p style="font-size:16px;">Hello ${ownerName},</p>
  <p style="font-size:16px;">${buyerName} has just purchased items from your store. Here are the details:</p>

  <table style="width:100%; border-collapse:collapse; margin-top:20px;">
    <thead>
      <tr style="background:#FF5722; color:#fff;">
        <th style="padding:10px; text-align:left;">Product</th>
        <th style="padding:10px; text-align:center;">Quantity</th>
        <th style="padding:10px; text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(i => `
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px;">
            <img src="${i.image}" width="50" style="vertical-align:middle; border-radius:5px; margin-right:10px;"/> ${i.name}
          </td>
          <td style="padding:10px; text-align:center;">${i.quantity}</td>
          <td style="padding:10px; text-align:right;">$${i.price}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p style="font-size:18px; text-align:right; margin-top:20px;"><strong>Total Amount: $${totalPrice}</strong></p>

  <p style="font-size:16px; color:#555;">Please process this order promptly to ensure a smooth experience for the buyer. Thank you for providing amazing products!</p>

  <p style="text-align:center; margin-top:30px;">
    <a href="https://yourstore.com/admin/orders" style="background:#FF5722; color:white; padding:12px 25px; text-decoration:none; border-radius:5px;">View Order</a>
  </p>

  <hr style="margin:40px 0; border:none; border-top:1px solid #ffd0c4;"/>
  
  <p style="font-size:14px; color:#888; text-align:center;">Keep up the great work! Every order counts towards your success 🚀</p>
</div>
`;

  }
  else if (data.type === "cancel") {
    // cancel email template
    buyerHtml = `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:30px; background:#fff3f0; border-radius:10px; border:1px solid #ffd0c4;">
        <h1 style="color:#FF5722; text-align:center;">❌ Purchase Canceled</h1>
        <p>Hi ${data.buyerName},</p>
        <p>Your purchase of the following product has been successfully canceled:</p>
        <ul>
          ${data.items.map(i => `<li><img src="${i.image}" width="50"/> ${i.name} - $${i.price}</li>`).join('')}
        </ul>
        <p>Total refunded amount: <strong>$${data.totalPrice}</strong></p>
        <p>We hope to serve you again soon!</p>
      </div>
    `;

    ownerHtml = `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:30px; background:#f9f9f9; border-radius:10px; border:1px solid #ddd;">
        <h1 style="color:#FF5722; text-align:center;">⚠️ Order Canceled</h1>
        <p>Hi ${data.ownerName},</p>
        <p>${data.buyerName} has canceled their purchase of the following product:</p>
        <ul>
          ${data.items.map(i => `<li><img src="${i.image}" width="50"/> ${i.name} - $${i.price}</li>`).join('')}
        </ul>
        <p>Total amount affected: <strong>$${data.totalPrice}</strong></p>
        <p>Please adjust your inventory accordingly.</p>
      </div>
    `;
  }

    const { buyerEmail, buyerName, ownerEmail, ownerName, items, totalPrice } = JSON.parse(msg.content.toString());
    console.log("📥 Received purchase job:", buyerEmail);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });




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
