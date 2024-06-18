import { OrgChangeOrganizationTree } from '../../../src/data-contracts/backend/data-contracts';
import { orgChangeComments } from '../../fixtures/orgchange/comments';
import { companyOrganizations } from '../../fixtures/orgchange/companyOrganizations';
import { draftNew } from '../../fixtures/orgchange/draftNew';
import { orgTreeNewNode } from '../../fixtures/orgchange/orgTreeNewNode';

interface BeforeEachDraftProps {
  orgTree?: OrgChangeOrganizationTree[];
  intercepts?: () => void;
}

export const beforeEachDraft = ({ orgTree = orgTreeNewNode, intercepts = () => ({}) }: BeforeEachDraftProps = {}) => {
  cy.intercept('POST', '**/api/orgchange/draft', { data: 'id-hash-Draftname3', message: 'success' }).as('postDraft');
  cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3', { data: draftNew, message: 'success' }).as(
    'getDraft'
  );
  cy.intercept('GET', '**/api/orgchange/draft/comments/id-hash-Draftname3', {
    data: orgChangeComments,
    message: 'success',
  }).as('getDraftComments');
  cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', { data: orgTree, message: 'success' }).as(
    'getOrgTree'
  );
  cy.intercept('GET', '**/api/mdviewer/organization/1/company', { data: companyOrganizations, message: 'success' }).as(
    'getCompanyOrganizations'
  );

  intercepts();

  cy.visit('/hanteraorganisation/utkast/id-hash-Draftname3');
};
