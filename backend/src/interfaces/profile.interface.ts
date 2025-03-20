import { Profile as SamlProfile } from '@node-saml/passport-saml';

export interface Profile extends SamlProfile {
  groups: string;
  givenName: string;
  surname: string;
  attributes: { [key: string]: any };
}
