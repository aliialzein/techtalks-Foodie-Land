import { emailLayout } from "../../shared/email-layout";
import { EMAIL_SUBJECTS } from "../../shared/email.constants";

export function reservationNewRequestTemplate(
  restaurantName: string,
  customerName: string,
  customerEmail: string,
  dateTime: Date,
  peopleCount: number,
  notes?: string | null,
) {
  return {
    subject: EMAIL_SUBJECTS.reservation.newRequest,

    html: emailLayout(
      "New Reservation Request",
      `
<p>Hello <strong>${restaurantName}</strong>,</p>

<p>
You have received a new reservation request through
<strong>FoodieLand</strong>.
</p>

<p>
<strong>Customer Details:</strong>
</p>

<ul>
  <li>Name: ${customerName}</li>
  <li>Email: ${customerEmail}</li>
</ul>

<p>
<strong>Reservation Details:</strong>
</p>

<ul>
  <li>Date: ${dateTime.toLocaleDateString()}</li>
  <li>Time: ${dateTime.toLocaleTimeString()}</li>
  <li>Guests: ${peopleCount}</li>
  <li>Special Requests: ${notes ?? "None"}</li>
</ul>

<p>
Please review this reservation from your dashboard and confirm or decline it as soon as possible.
</p>
`,
    ),

    text: `
New reservation request.

Customer: ${customerName}
Email: ${customerEmail}
Date: ${dateTime.toLocaleDateString()}
Time: ${dateTime.toLocaleTimeString()}
Guests: ${peopleCount}
Special Requests: ${notes ?? "None"}
`,
  };
}