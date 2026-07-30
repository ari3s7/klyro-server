import { resend } from "../config/resend.js"
import { verificationEmailTemplate } from "./templates/verification-email.js";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  return sendEmail({
    to: email,
    subject: "Verify your Klyro account",
    html: verificationEmailTemplate(verificationUrl),
  });
}
