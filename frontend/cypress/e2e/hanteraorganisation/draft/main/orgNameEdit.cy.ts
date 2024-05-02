import { beforeEachDraft } from '../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - OrgNameEdit', () => {
  beforeEach(() => {
    beforeEachDraft();
  });

  it('Make an edit on all fields', () => {
    cy.intercept('PUT', '**/api/orgchange/orgnode/rename', { data: true, message: 'success' }).as('putOrgNodeRename');
    cy.intercept('PUT', '**/api/orgchange/orgnode/responsibilitycodepart', { data: true, message: 'success' }).as(
      'putOrgNodeRespCode'
    );

    cy.wait('@getOrgTree');

    cy.get('.sk-sidemenu .sk-sidemenu-item.lvl-0 .sk-sidemenu-item-link').first().click();

    cy.get('input[name="orgName"]').should('have.value', 'Uslands skola').click();
    cy.get('input[name="orgName"]').type('null').clear();
    cy.get('input[name="orgName"]')
      .should('have.value', '')
      .should('have.attr', 'placeholder', 'Organisationsnamn')
      .invoke('val', 'Uslands skola editerad');
    cy.get('input[name="orgName"]').should('have.value', 'Uslands skola editerad');

    cy.get('input[name="orgNameShort"]').should('have.value', 'Uslands skola').click();
    cy.get('input[name="orgNameShort"]').type('null').clear();
    cy.get('input[name="orgNameShort"]').should('have.value', '').invoke('val', 'Uslands skola kortnamn');
    cy.get('input[name="orgNameShort"]').should('have.value', 'Uslands skola kortnamn');

    cy.get('input[name="abbreviation"]').should('have.value', 'ABC').click();
    cy.get('input[name="abbreviation"]').type('null').clear();
    cy.get('input[name="abbreviation"]')
      .should('have.value', '')
      .should('have.attr', 'placeholder', 'ABC')
      .invoke('val', 'FÖR');
    cy.get('input[name="abbreviation"]').should('have.value', 'FÖR');

    cy.get('input[name="responsibilityCode"]').should('have.value', '0').click();
    cy.get('input[name="responsibilityCode"]').type('null').clear();
    cy.get('input[name="responsibilityCode"]').invoke('val', '3');
    cy.get('input[name="responsibilityCode"]').should('have.value', '3');

    cy.get('button').contains('Spara').click();

    cy.get('div').contains('Ändringarna har sparats').should('be.visible');

    cy.wait('@putOrgNodeRename').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
    });
    cy.wait('@putOrgNodeRespCode').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
    });
  });
});
