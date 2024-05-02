import { orgTreeAddNode } from '../../../../fixtures/orgchange/orgTreeAddNode';
import { orgTreeNewNode } from '../../../../fixtures/orgchange/orgTreeNewNode';
import { beforeEachDraft } from '../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - aside - Sidemenu', () => {
  beforeEach(() => {
    beforeEachDraft({ orgTree: [] });
  });

  it('Add existing node', () => {
    cy.intercept('PUT', '**/api/orgchange/orgnode/add', { data: true, message: 'success' }).as('putOrgNodeAdd');

    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeAddNode,
      message: 'success',
    }).as('getOrgTree');

    cy.get('button[data-cy="orgchange-sidemenu-addnode"]').click();

    cy.get('input[data-cy="orgchange-choosebranch-searchnode"]').type('Uslands skola');

    cy.get('#orgchange-choosebranch-searchnode-list').contains('Uslands skola - Nivå 5').should('be.visible').click();
    cy.get('button').contains('Spara').click();
  });

  it('Create new node', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeAddNode,
      message: 'success',
    }).as('getOrgTree');

    cy.intercept('POST', '**/api/orgchange/orgnode', { data: 123, message: 'success' }).as('postCreateNode');

    // Select parent that should get new node
    cy.get('.Sidebar .sk-sidemenu-item.lvl-0 .sk-sidemenu-item-link').click();

    cy.wait('@getOrgTree');

    // Click Create new node button
    cy.get('button[data-cy="orgchange-sidemenu-createnode"]').click();

    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeNewNode,
      message: 'success',
    }).as('getOrgTree');

    cy.get('[aria-modal="true"]').contains('Ja skapa gren').click();

    cy.get('.sk-sidemenu-item-label').contains('Ny gren').should('exist');
  });

  it('Show/Search', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeNewNode,
      message: 'success',
    }).as('getOrgTree');

    // Open
    cy.get('button').contains('Visa/sök').click();

    cy.get('ul[aria-label="Sökfilter"]')
      .should('be.visible')
      .within(() => {
        cy.get('li.filter-item').contains('Nivåer').click();
        cy.get('li.filter-item').contains('Ansvarskod').click();
        cy.get('li.filter-item').contains('Förkortningar').click();
      });

    // Close
    cy.get('button').contains('Visa/sök').click();

    cy.get('.sk-sidemenu-item.lvl-0 .expand').click();

    // Assert new state
    // Code
    cy.get('.sk-sidemenu-item.lvl-0').contains('9400').should('be.visible');
    cy.get('.sk-sidemenu-item.lvl-1').contains('94001').should('be.visible');

    // Levels
    cy.get('.sk-sidemenu-item.lvl-0 .expand').contains('N5').should('be.visible');
    cy.get('.sk-sidemenu-item.lvl-1').contains('N6').should('be.visible');

    // Abbreviations
    cy.get('.sk-sidemenu-item.lvl-0').contains('CDE Uslands skola').should('be.visible');

    // Search "CDE Uslands skola"
    // Open
    cy.get('button').contains('Visa/sök').click();
    cy.get('input[aria-label="Sök gren i menyn"]').click();
    cy.get('input[aria-label="Sök gren i menyn"]').type('CDE Uslands skola');
    cy.focused().type('{downArrow}');
    cy.focused().type('{enter}');
    cy.get('ul[aria-label="Organisationsmeny"] [aria-current="true"]').should(
      'have.text',
      'CDE Uslands skola, Kod: 9400, Nivå: 5'
    );
  });

  it('Aktivt val visas', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeNewNode,
      message: 'success',
    }).as('getOrgTree');

    cy.get('.sk-sidemenu [aria-current="true"]').should('not.exist');

    cy.get('.sk-sidemenu').contains('[role="menuitem"]', 'Uslands skola').click();
    cy.get('.sk-sidemenu [aria-current="true"]').should('be.visible');
  });
});
