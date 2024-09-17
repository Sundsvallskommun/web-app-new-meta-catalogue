import { cleanEnv, makeValidator, port, str, url } from 'envalid';

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // same as used in envalid

const emails = makeValidator(emailString => {
  const mailAdresses = emailString.split(',');
  mailAdresses.forEach(email => {
    if (!emailRegex.test(email)) throw new Error('Emails not formatted correctly. Should be "a@example.com" or "a@example.com,b@example.com"');
  });
  return emailString;
});

// NOTE: Make sure we got these in ENV
const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    SECRET_KEY: str(),
    API_BASE_URL: str(),
    CLIENT_KEY: str(),
    CLIENT_SECRET: str(),
    PORT: port(),
    BASE_URL_PREFIX: str(),
    SAML_CALLBACK_URL: url(),
    SAML_LOGOUT_CALLBACK_URL: url(),
    SAML_FAILURE_REDIRECT: url(),
    SAML_ENTRY_SSO: url(),
    SAML_ISSUER: str(),
    SAML_IDP_PUBLIC_CERT: str(),
    SAML_PRIVATE_KEY: str(),
    SAML_PUBLIC_KEY: str(),
    MAIL_PERSONDETAILS: emails(),
    MAIL_PERSON: emails(),
    MAIL_RESPONSIBILITY: emails(),
    MAIL_OPERATION: emails(),
    MAIL_SYSTEM: emails(),
    MAIL_SUPPORT: emails(),
    MAIL_OTHER: emails(),
    MUNICIPALITY_ID: str(),
  });
};

export default validateEnv;
