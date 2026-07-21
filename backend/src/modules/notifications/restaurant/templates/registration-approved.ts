import { EMAIL_SUBJECTS } from "../../shared/email.constants";
import { emailLayout } from "../../shared/email-layout";

export function restaurantApprovedTemplate(
  ownerName: string,
  restaurantName: string,
) {
  return {
    subject: EMAIL_SUBJECTS.restaurant.approved,

    html: emailLayout(
      "Restaurant Approved",
      `
<p>Hello <strong>${ownerName}</strong>,</p>

<p>

Congratulations!

</p>

<p>

Your restaurant
<strong>${restaurantName}</strong>
has been approved.

</p>

<p>

Customers can now discover your restaurant and begin placing orders and reservations.

</p>

<p>

Welcome to FoodieLand!

</p>
`,
    ),

    text: `${restaurantName} has been approved.`,
  };
}