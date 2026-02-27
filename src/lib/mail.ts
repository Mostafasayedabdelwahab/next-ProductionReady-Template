// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendResetPasswordEmail(
//   to: string,
//   resetLink: string
// ) {
//   await resend.emails.send({
//     from: process.env.FROM_EMAIL!,
//     to,
//     subject: "Reset your password",
//     html: `
//       <div style="font-family: Arial, sans-serif">
//         <h2>Password Reset</h2>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetLink}">${resetLink}</a>
//         <p>This link expires in 15 minutes.</p>
//       </div>
//     `,
//   });
// }


export async function sendResetPasswordEmail(
  email: string,
  resetUrl: string
) {
  await mailer.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family:Arial; line-height:1.6">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendEmailVerificationEmail(
  email: string,
  resetUrl: string
) {
  await mailer.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family:Arial; line-height:1.6">
        <h2>Verify your email address</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}




import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // ❗true مع 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await mailer.verify();



