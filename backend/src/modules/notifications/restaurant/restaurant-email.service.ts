import logger from "@/util/logger";
import { EmailService } from "@/lib/email";

import { registrationReceivedTemplate } from "./templates/registration-received";
import { restaurantApprovedTemplate } from "./templates/registration-approved";
import { restaurantRejectedTemplate } from "./templates/registration-rejected";

export class RestaurantEmailService {
  static async sendRegistrationReceived(
    email: string,
    ownerName: string,
    restaurantName: string,
  ) {
    return this.send(
      email,
      registrationReceivedTemplate(ownerName, restaurantName),
    );
  }

  static async sendApproved(
    email: string,
    ownerName: string,
    restaurantName: string,
  ) {
    return this.send(
      email,
      restaurantApprovedTemplate(ownerName, restaurantName),
    );
  }

  static async sendRejected(
    email: string,
    ownerName: string,
    restaurantName: string,
    reason?: string | null,
  ) {
    return this.send(
      email,
      restaurantRejectedTemplate(ownerName, restaurantName, reason),
    );
  }

  private static async send(
    email: string,
    template: {
      subject: string;
      html: string;
      text: string;
    },
  ) {
    try {
      await EmailService.send({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      logger.info("Notification email sent", {
        email,
        subject: template.subject,
      });
    } catch (error) {
      logger.error("Notification email failed", {
        email,
        subject: template.subject,
        error,
      });

      // Don't throw; email delivery shouldn't fail the business operation.
    }
  }
  static async sendNewRegistrationToAdmin(
    adminEmail: string,
    adminName: string,
    restaurantName: string,
    ownerName: string,
    ownerEmail: string,
  ) {
    return EmailService.send({
      to: adminEmail,
      subject: `New Restaurant Registration - ${restaurantName}`,
      html: `
        <h2>New Restaurant Registration</h2>

        <p>Hello ${adminName},</p>

        <p>A new restaurant registration has been submitted and is waiting for review.</p>

        <ul>
          <li><strong>Restaurant:</strong> ${restaurantName}</li>
          <li><strong>Owner:</strong> ${ownerName}</li>
          <li><strong>Owner Email:</strong> ${ownerEmail}</li>
        </ul>

        <p>Please review it from the admin dashboard.</p>
      `,
      text: `
  New Restaurant Registration

  Restaurant: ${restaurantName}
  Owner: ${ownerName}
  Owner Email: ${ownerEmail}

  Please review it from the admin dashboard.
  `,
    });
  }
}