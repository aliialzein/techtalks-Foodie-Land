import { emailLayout } from "../../shared/email-layout";
import { EMAIL_SUBJECTS } from "../../shared/email.constants";

export function reservationConfirmedTemplate(
  customerName: string,
  restaurantName: string,
  dateTime: Date,
  peopleCount: number,
) {
  return {
    subject: EMAIL_SUBJECTS.reservation.confirmed,

    html: emailLayout(
      "Reservation Confirmed",
      `
<p>Hello <strong>${customerName}</strong>,</p>

<p>
Your reservation at
<strong>${restaurantName}</strong>
has been confirmed.
</p>

<p>
<strong>Reservation Details:</strong>
</p>

<ul>
<li>Date: ${dateTime.toLocaleDateString()}</li>
<li>Time: ${dateTime.toLocaleTimeString()}</li>
<li>Guests: ${peopleCount}</li>
</ul>

<p>
We look forward to welcoming you.
</p>
`,
    ),

    text: `Your reservation at ${restaurantName} has been confirmed.`,
  };
}