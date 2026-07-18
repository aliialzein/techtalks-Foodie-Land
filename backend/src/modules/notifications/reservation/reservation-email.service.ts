import logger from "@/util/logger";
import { EmailService } from "@/lib/email";

import { reservationSubmittedTemplate } from "./templates/reservation-submitted";
import { reservationConfirmedTemplate } from "./templates/reservation-confirmed";
import { reservationCancelledTemplate } from "./templates/reservation-cancelled";

export class ReservationEmailService {

  static async sendSubmitted(
    email: string,
    customerName: string,
    restaurantName: string,
    dateTime: Date,
    peopleCount: number,
  ) {
    return this.send(
      email,
      reservationSubmittedTemplate(
        customerName,
        restaurantName,
        dateTime,
        peopleCount,
      ),
    );
  }


  static async sendConfirmed(
    email: string,
    customerName: string,
    restaurantName: string,
    dateTime: Date,
    peopleCount: number,
  ) {
    return this.send(
      email,
      reservationConfirmedTemplate(
        customerName,
        restaurantName,
        dateTime,
        peopleCount,
      ),
    );
  }


  static async sendCancelled(
    email: string,
    customerName: string,
    restaurantName: string,
    reason?: string | null,
  ) {
    return this.send(
      email,
      reservationCancelledTemplate(
        customerName,
        restaurantName,
        reason,
      ),
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


      logger.info(
        "Reservation notification email sent",
        {
          email,
          subject: template.subject,
        },
      );


    } catch(error) {

      logger.error(
        "Reservation notification email failed",
        {
          email,
          subject: template.subject,
          error,
        },
      );

      // Do not break reservation flow
    }
  }
}