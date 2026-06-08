const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return null;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App Password de Gmail (sin espacios)
    },
  });
  return transporter;
}

function loadTemplate(name, vars = {}) {
  const file = path.join(__dirname, '..', 'templates', 'emails', `${name}.html`);
  let html = fs.readFileSync(file, 'utf8');
  for (const [k, v] of Object.entries(vars)) {
    html = html.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v));
  }
  return html;
}

async function send(to, subject, templateName, vars = {}) {
  const tx = getTransporter();
  if (!tx) {
    console.warn('[Email] EMAIL_USER/EMAIL_PASSWORD no configurados. Skip:', subject);
    return null;
  }
  try {
    const html = loadTemplate(templateName, vars);
    const from = process.env.EMAIL_FROM || `KRONOS <${process.env.EMAIL_USER}>`;
    const info = await tx.sendMail({ from, to, subject, html });
    console.log('[Email] enviado:', info.messageId);
    return info;
  } catch (err) {
    console.error('[Email] excepción:', err.message);
    return null;
  }
}

const APP_URL = process.env.CLIENT_URL || 'https://kronos-super-app.vercel.app';

module.exports = {
  sendWelcome: (to, name) =>
    send(to, '¡Bienvenido a Kronos! 🌟', 'welcome', { name, appUrl: APP_URL }),
  sendPasswordReset: (to, name, link) =>
    send(to, 'Restablece tu contraseña — Kronos', 'password-reset', { name, link }),
  sendOrderConfirmation: (to, name, orderId, total) =>
    send(to, `Orden ${orderId} confirmada — Kronos`, 'order-confirmation', { name, orderId, total }),
  sendRefund: (to, name, orderId, amount) =>
    send(to, `Reembolso procesado — ${orderId}`, 'refund', { name, orderId, amount }),
};
