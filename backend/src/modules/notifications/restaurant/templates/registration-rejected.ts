import { EMAIL_SUBJECTS } from "../../shared/email.constants";
import { emailLayout } from "../../shared/email-layout";

export function restaurantRejectedTemplate(
  ownerName: string,
  restaurantName: string,
  reason?: string | null,
) {
  return {
    subject: EMAIL_SUBJECTS.restaurant.rejected,

    html: emailLayout(
      "Restaurant Registration Update",
      `
<p>Hello <strong>${ownerName}</strong>,</p>

<p>

Unfortunately, your restaurant
<strong>${restaurantName}</strong>
was not approved.

</p>

${
  reason
    ? `<p><strong>Reason:</strong> ${reason}</p>`
    : ""
}

<p>

You may update your submission and apply again.

</p>
`,
    ),

    text: `${restaurantName} was not approved.`,
  };
}