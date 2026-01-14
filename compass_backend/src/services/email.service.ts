import { Resend } from "resend";
import { env } from "../config/env.js";

type LeadNotification = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message?: string;
};

export async function sendLeadNotification(payload: LeadNotification) {
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured, skipping email.");
    return { skipped: true };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const subject = `New lead: ${payload.name}`;
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

  // Use the verified sender (or onboarding one)
  // If EMAIL_FROM is not set, default to onboarding@resend.dev
  const from = env.EMAIL_FROM || "onboarding@resend.dev";
  const to = env.EMAIL_TO || "delivered@resend.dev"; // Fallback for safety

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: payload.email
    });

    return { sent: true, id: data.data?.id };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    throw error;
  }
}
