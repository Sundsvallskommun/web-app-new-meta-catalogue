import { Controller, Body, Post, HttpCode, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { IsString } from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { MAIL_PERSONDETAILS, MAIL_PERSON, MAIL_RESPONSIBILITY, MAIL_OPERATION, MAIL_SYSTEM, MAIL_SUPPORT, MAIL_OTHER } from '@config';

const messageHTML = userData => {
  const lines = sanitizeHtml(userData.body, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .split('\n')
    .map(line => (line ? '<p>' + line + '</p>' : '<br>'))
    .join('');
  const msg = `
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback för Masterdata</title>
</head>
<body>
    <h1>Vald feltyp: ${userData.typeLabel}</h1>
    <p><strong>Användarens feedback:</strong></p>
    ${lines}
</body>
</html>
  `;
  return msg.trim();
};

const typeToEmail = {
  PERSONDETAILS: MAIL_PERSONDETAILS,
  PERSON: MAIL_PERSON,
  RESPONSIBILITY: MAIL_RESPONSIBILITY,
  OPERATION: MAIL_OPERATION,
  SYSTEM: MAIL_SYSTEM,
  SUPPORT: MAIL_SUPPORT,
  OTHER: MAIL_OTHER,
};

const message = (body: string) => {
  const msg = body;
  return msg.trim();
};

const base64Encode = (str: string) => {
  return Buffer.from(str, 'utf-8').toString('base64');
};

export class FeedbackDto {
  @IsString()
  body: string;
  @IsString()
  type: string;
  @IsString()
  typeLabel: string;
}

@Controller()
export class FeedbackController {
  private apiService = new ApiService();

  @Post('/feedback')
  @HttpCode(201)
  @OpenAPI({ summary: 'Send feedback through email' })
  @UseBefore(authMiddleware, validationMiddleware(FeedbackDto, 'body'))
  async sendFeedback(@Body() userData: FeedbackDto): Promise<any> {
    const emailString = typeToEmail[userData.type];
    if (emailString) {
      const mailAdresses = emailString.split(',');
      mailAdresses.forEach(async email => {
        const sendFeedback = {
          sender: {
            name: 'Masterdata',
            address: 'no-reply@sundsvall.se',
          },
          emailAddress: email,
          subject: 'Feedback för Masterdata',
          message: message(userData.body),
          // TODO: seems like html message gets wrong encoding? ÅÄÖ not working.
          htmlMessage: base64Encode(messageHTML(userData)),
        };
        const url = 'messaging/3.3/email';
        await this.apiService.post({ url, data: sendFeedback });
      });
    }

    return { message: 'feedback sent' };
  }
}
