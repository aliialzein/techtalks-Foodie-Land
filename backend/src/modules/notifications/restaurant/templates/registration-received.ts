import { EMAIL_SUBJECTS } from "../../shared/email.constants";
import { emailLayout } from "../../shared/email-layout";

export function registrationReceivedTemplate(
  ownerName: string,
  restaurantName: string,
) {
  return {
    subject: EMAIL_SUBJECTS.restaurant.registrationReceived,

    html: emailLayout(
      "Registration Received",
      `
<p>Hello <strong>${ownerName}</strong>,</p>

<p>

Thank you for submitting your restaurant
<strong>${restaurantName}</strong>.

</p>

<p>

Our administrators are reviewing your application.

</p>

<p>

You will receive another email once the review has been completed.

</p>

<p>

Thank you for choosing FoodieLand.

</p>
`,
    ),

    text: `Your restaurant "${restaurantName}" has been received and is currently under review.`,
  };
}