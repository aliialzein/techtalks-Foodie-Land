import { emailLayout } from "../../shared/email-layout";
import { EMAIL_SUBJECTS } from "../../shared/email.constants";

export function reservationSubmittedTemplate(
  customerName: string,
  restaurantName: string,
  dateTime: Date,
  peopleCount: number,
) {
  return {
    subject: EMAIL_SUBJECTS.reservation.submitted,

    html: emailLayout(
      "Reservation Received",
      `
<p>Hello <strong>${customerName}</strong>,</p>

<p>
Your reservation request at
<strong>${restaurantName}</strong>
has been received.
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
Your reservation is currently pending confirmation from the restaurant.
</p>

<p>
You will receive another email once it has been confirmed.
</p>
`,
    ),

    text: `Your reservation at ${restaurantName} has been received and is awaiting confirmation.`,
  };
}