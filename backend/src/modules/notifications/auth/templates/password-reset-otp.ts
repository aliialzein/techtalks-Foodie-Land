import { emailLayout } from "../../shared/email-layout";

export function passwordResetOtpTemplate(
  name: string,
  otp: string,
) {
  return emailLayout(
    "Password Reset Request",
    `
    <p>Hello ${name},</p>

    <p>
      We received a request to reset your FoodieLand password.
    </p>

    <p>
      Your verification code is:
    </p>

    <h1>
      ${otp}
    </h1>

    <p>
      This code expires in 10 minutes.
    </p>

    <p>
      If you did not request this, you can safely ignore this email.
    </p>
    `,
  );
}