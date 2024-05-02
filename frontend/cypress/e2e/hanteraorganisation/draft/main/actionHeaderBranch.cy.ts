import { orgTreeMoveNode } from '../../../../fixtures/orgchange/orgTreeMoveNode';
import { beforeEachDraft } from '../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - ActionHeaderBranch', () => {
  beforeEach(() => {
    beforeEachDraft({ orgTree: orgTreeMoveNode });

    cy.get('.sk-sidemenu .sk-sidemenu-item.lvl-0:first-child .sk-sidemenu-item-link').click();
  });

  it('Move node', () => {
    cy.intercept('PUT', '**/api/orgchange/orgnode/move', { data: true, message: 'success' }).as('putOrgNodeMove');

    cy.get('button').contains('Flytta gren').click();

    cy.get('[aria-modal="true"]').contains('Flytta gren').should('be.visible');

    cy.get('[aria-modal="true"] input#orgchange-move-branch').type('Buslands område');

    cy.get('input[name="orgchange-move-branch-option"]').first().click();

    cy.get('[aria-modal="true"] button').contains('Flytta gren').click();

    cy.get('[aria-modal="true"]').contains('Är du säker på att flytta grenen?').should('be.visible');

    cy.get('[aria-modal="true"] button').contains('Ja, flytta gren').click();

    cy.get('[aria-modal="true"]').should('not.exist');

    cy.wait('@getOrgTree', { timeout: 3000 }).then(() => {
      cy.get('div')
        .contains('Grenen flyttas från Uslands skola nivå 5 till Buslands område nivå 4')
        .should('be.visible');
    });
  });

  it('Remove node', () => {
    cy.intercept('PUT', '**/api/orgchange/orgnode/**/remove', { data: true, message: 'success' }).as(
      'putOrgNodeRemove'
    );

    cy.get('button').contains('Uteslut gren från utkast').click();

    cy.get('[aria-modal="true"]')
      .contains('Är du säker på att du vill utesluta grenen från utkastet?')
      .should('be.visible');

    cy.get('[aria-modal="true"] button').contains('Ja, uteslut').click();

    cy.wait('@getOrgTree', { timeout: 3000 }).then(() => {
      cy.get('div').contains('Grenen uteslöts från utkastet', { timeout: 3000 }).should('be.visible');
    });
  });

  it('Terminate node', () => {
    cy.intercept('DELETE', '**/api/orgchange/orgnode/**', { data: true, message: 'success' }).as(
      'deleteOrgNodeTerminate'
    );

    cy.get('button').contains('Stäng gren').click();

    cy.get('[aria-modal="true"]').contains('Stäng gren').should('be.visible');
    cy.get('[aria-modal="true"] button').contains('Stäng gren').should('be.visible').click();

    cy.get('[aria-modal="true"]').contains('Är du säker på att du vill stänga grenen?').should('be.visible');
    cy.get('[aria-modal="true"] button').contains('Ja, stäng').click();

    cy.wait('@getOrgTree', { timeout: 3000 }).then(() => {
      cy.get('[aria-modal="true"]').should('not.exist');
      cy.get('div').contains('Ändringar på grenen sparas', { timeout: 3000 }).should('be.visible');
    });
  });
  it('Undo terminate node', () => {
    cy.intercept('POST', '**/api/orgchange/orgnode/undodelete/194', { data: true, message: 'success' }).as(
      'undoTerminateNode'
    );

    cy.get('button').contains('Visemans skolgrupp').click();
    cy.get('button').contains('Ångra stäng gren').click();

    cy.get('[aria-modal="true"]').contains('Ja, ångra').should('be.visible').click();
  });
});
