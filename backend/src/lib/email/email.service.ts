import { transporter } from "./smtp";
import type { SendEmailOptions } from "./email.types";
import logger from "@/util/logger";

export class EmailService {
  static async send({
    to,
    subject,
    html,
    text,
  }: SendEmailOptions): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
        text,
      });

      logger.info("Email sent", {
        to,
        subject,
      });
    } catch (error) {
      logger.error("Failed to send email", {
        to,
        subject,
        error,
      });

      throw error;
    }
  }
}