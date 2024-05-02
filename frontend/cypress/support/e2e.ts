import '@cypress/code-coverage/support';

import { orgTreeResponse } from '../fixtures/getOrgtree';
import { user } from '../fixtures/mockUser';
import { alert } from '../fixtures/alert';
import { organizationRoot } from '../fixtures/organizationRoot';
import { organization } from '../fixtures/organization';

const COOKIE_NAME = 'SKCookieConsent';
const COOKIE_VALUE = 'necessary%2Cfunc%2Cstats';

localStorage.clear();

Cypress.on('window:before:load', (window) => {
  window.document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}`;
});

beforeEach(() => {
  cy.viewport('macbook-16');
  cy.intercept('GET', '**/api/me', user).as('getUser');
  cy.intercept('GET', '**/api/alert', { data: alert, message: 'success' });
  cy.intercept('GET', '**/api/mdviewer/organization/root', organizationRoot);
  cy.intercept('GET', '**/api/mdviewer/organization/1', organization);
  cy.intercept('GET', '**/api/mdviewer/organization/13/orgtree/0', orgTreeResponse);
});
