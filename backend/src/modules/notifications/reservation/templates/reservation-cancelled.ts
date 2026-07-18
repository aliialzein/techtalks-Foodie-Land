import { emailLayout } from "../../shared/email-layout";
import { EMAIL_SUBJECTS } from "../../shared/email.constants";

export function reservationCancelledTemplate(
  customerName: string,
  restaurantName: string,
  reason?: string | null,
) {
  return {
    subject: EMAIL_SUBJECTS.reservation.cancelled,

    html: emailLayout(
      "Reservation Cancelled",
      `
<p>Hello <strong>${customerName}</strong>,</p>

<p>
Your reservation at
<strong>${restaurantName}</strong>
has been cancelled.
</p>

${
  reason
    ? `
<p>
<strong>Reason:</strong>
${reason}
</p>
`
    : ""
}

<p>
If you have any questions, please contact the restaurant.
</p>
`,
    ),

    text: `Your reservation at ${restaurantName} has been cancelled.`,
  };
}