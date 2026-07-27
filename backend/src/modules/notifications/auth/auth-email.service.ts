import { EmailService } from "@/lib/email/email.service";
import { passwordResetOtpTemplate } from "./templates/password-reset-otp";
import { passwordChangedTemplate } from "./templates/password-changed";


export class AuthEmailService {

  static async sendPasswordResetOtp(
    email: string,
    name: string,
    otp: string,
  ) {

    return EmailService.send({
      to: email,

      subject:
        "FoodieLand Password Reset Code",

      html:
        passwordResetOtpTemplate(
          name,
          otp,
        ),
    });

  }


  static async sendPasswordChanged(
    email: string,
    name: string,
  ) {

    return EmailService.send({
      to: email,

      subject:
        "FoodieLand Password Changed",

      html:
        passwordChangedTemplate(name),
    });

  }

}