import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(
  to: string,
  resetLink: string
) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `,
  });
}
