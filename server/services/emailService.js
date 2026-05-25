const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

let resend = null;

function getClient() {
  if (resend) return resend;
  if (!process.env.RESEND_API_KEY) return null;
  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
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
  const client = getClient();
  if (!client) {
    console.warn('[Email] RESEND_API_KEY no configurado. Skip:', subject);
    return null;
  }
  try {
    const html = loadTemplate(templateName, vars);
    const from = process.env.EMAIL_FROM || 'Kronos <noreply@kronos-app.com>';
    const { data, error } = await client.emails.send({ from, to, subject, html });
    if (error) {
      console.error('[Email] error Resend:', error);
      return null;
    }
    console.log('[Email] enviado:', data?.id);
    return data;
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
