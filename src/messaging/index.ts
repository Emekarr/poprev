import SendgridMessenger from "./emails/sendgrid";

class EmailService extends SendgridMessenger {}

export const emailService = Object.freeze(new EmailService());
