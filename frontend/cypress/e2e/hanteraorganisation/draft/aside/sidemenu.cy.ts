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
    cy.get('[data-cy="organization-tree"] > li [role="menuitem"]').first().click();

    cy.wait('@getOrgTree');

    // Click Create new node button
    cy.get('button[data-cy="orgchange-sidemenu-createnode"]').click();

    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeNewNode,
      message: 'success',
    }).as('getOrgTree');

    cy.get('[aria-modal="true"]').contains('Ja, skapa gren').click();

    cy.get('[data-cy="organization-tree"] [role="menuitem"]').contains('Ny gren').should('exist');
  });

  it('Drag and drop branch to new parent', () => {
    const [parent] = orgTreeNewNode;
    const child = parent.subItems![0];
    const dragTree = [
      { ...parent, subItems: [{ ...child, parentId: parent.id }] },
      { ...parent, id: 193, label: 'Annan skola', orgName: 'Annan skola', subItems: [] },
    ];
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', { data: dragTree, message: 'success' }).as(
      'getDragTree'
    );
    cy.reload();
    cy.wait('@getDragTree');

    cy.get('[data-cy="tree-item-192"] .sk-menu-vertical-item-submenu-button-expand').first().click();

    // Dropping on the current parent does nothing
    const toCurrentParent = new DataTransfer();
    cy.get('[data-cy="tree-item-123"]').trigger('dragstart', { dataTransfer: toCurrentParent });
    cy.get('[data-cy="tree-item-192"]').trigger('dragover', { dataTransfer: toCurrentParent });
    cy.get('[data-cy="tree-item-192"]').trigger('drop', { dataTransfer: toCurrentParent });
    cy.get('[aria-modal="true"]').should('not.exist');

    // Dropping on another parent one level up asks to confirm the move from the old to the new parent
    const toNewParent = new DataTransfer();
    cy.get('[data-cy="tree-item-123"]').trigger('dragstart', { dataTransfer: toNewParent });
    cy.get('[data-cy="tree-item-193"]').trigger('dragover', { dataTransfer: toNewParent });
    cy.get('[data-cy="tree-item-193"]').should('have.class', 'ring-2');
    cy.get('[data-cy="tree-item-193"]').trigger('drop', { dataTransfer: toNewParent });

    cy.get('[aria-modal="true"]').within(() => {
      cy.contains(`Flyttar ${child.label} nivå ${child.level}`).should('be.visible');
      cy.contains(`Förälder: ${parent.label} Nivå ${parent.level}`).should('be.visible');
      cy.contains('Förälder: Annan skola').should('be.visible');
      cy.contains('button', 'Spara').should('be.enabled');
    });
  });

  it('Show/Search', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeNewNode,
      message: 'success',
    }).as('getOrgTree');

    // Open
    cy.get('button').contains('Visa/sök').click();

    cy.get('#sideMenuSearchFilters')
      .should('be.visible')
      .within(() => {
        cy.get('.sk-popup-menu-item').contains('Nivåer').click();
        cy.get('.sk-popup-menu-item').contains('Ansvarskod').click();
        cy.get('.sk-popup-menu-item').contains('Förkortningar').click();
      });

    // Close
    cy.get('button').contains('Visa/sök').click();

    cy.get('[data-cy="organization-tree"] > li .sk-menu-vertical-item-submenu-button-expand').first().click();

    // Assert new state
    // Code
    cy.get('[data-cy="organization-tree"] > li').contains('9400').should('be.visible');
    cy.get('[data-cy="organization-tree"] ul [role="menuitem"]').contains('94001').should('be.visible');

    // Levels
    cy.get('[data-cy="organization-tree"] > li [role="menuitem"]').first().contains('N5').should('be.visible');
    cy.get('[data-cy="organization-tree"] ul [role="menuitem"]').contains('N6').should('be.visible');

    // Abbreviations
    cy.get('[data-cy="organization-tree"] > li').contains('CDE Uslands skola').should('be.visible');

    // Search "CDE Uslands skola"
    // Open
    cy.get('button').contains('Visa/sök').click();
    cy.get('input[aria-label="Sök gren i menyn"]').click();
    cy.get('input[aria-label="Sök gren i menyn"]').type('CDE Uslands skola');
    cy.contains('.sk-form-combobox-list-option:visible', 'Uslands skola').click();
    cy.get('[data-cy="organization-tree"] [aria-current="page"]')
      .should('contain.text', 'CDE Uslands skola')
      .and('contain.text', 'Kod: 9400')
      .and('contain.text', 'Nivå: N5');
  });

  it('Aktivt val visas', () => {
    cy.intercept('GET', '**/api/orgchange/draft/id-hash-Draftname3/tree', {
      data: orgTreeNewNode,
      message: 'success',
    }).as('getOrgTree');

    cy.get('[data-cy="organization-tree"] [aria-current="page"]').should('not.exist');

    cy.get('[data-cy="organization-tree"]').contains('[role="menuitem"]', 'Uslands skola').click();
    cy.get('[data-cy="organization-tree"] [aria-current="page"]').should('be.visible');
  });
});
