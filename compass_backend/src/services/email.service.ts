import nodemailer from "nodemailer";

import { env } from "../config/env.js";

type LeadNotification = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message?: string;
};

function isEmailConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.EMAIL_TO);
}

function resolveSecure() {
  if (env.SMTP_SECURE) return env.SMTP_SECURE === "true";
  return (env.SMTP_PORT ?? 465) === 465;
}

export async function sendLeadNotification(payload: LeadNotification) {
  if (!isEmailConfigured()) return { skipped: true };

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 465,
    secure: resolveSecure(),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  const subject = `New lead: ${payload.name}`;
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company ?? "-"}`,
    `Budget: ${payload.budget ?? "-"}`,
    `Message: ${payload.message ?? "-"}`
  ];

  const html = `
    <h2>New lead received</h2>
    <ul>
      <li><strong>Name:</strong> ${payload.name}</li>
      <li><strong>Email:</strong> ${payload.email}</li>
      <li><strong>Company:</strong> ${payload.company ?? "-"}</li>
      <li><strong>Budget:</strong> ${payload.budget ?? "-"}</li>
    </ul>
    <p><strong>Message</strong></p>
    <p>${payload.message ?? "-"}</p>
  `;

  await transporter.sendMail({
    from: env.EMAIL_FROM || env.SMTP_USER,
    to: env.EMAIL_TO,
    replyTo: payload.email,
    subject,
    text: lines.join("\n"),
    html
  });

  return { sent: true };
}
