import { emailLayout } from "../../shared/email-layout";

export function passwordChangedTemplate(
  name: string,
) {
  return emailLayout(
    "Password Changed Successfully",
    `
    <p>Hello ${name},</p>

    <p>
      Your FoodieLand password has been updated successfully.
    </p>

    <p>
      If you did not perform this action,
      please contact support immediately.
    </p>
    `,
  );
}