import { employees } from '../../../fixtures/employees';
import { orgTreeResponse } from '../../../fixtures/getOrgtree';
import { operations } from '../../../fixtures/operation';
import { organization } from '../../../fixtures/organization';
import { responsibilities } from '../../../fixtures/responsibilities';

describe('/organization - Aside', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display aside header elements and its contents', () => {
    cy.get('nav.sk-sidemenu').should('be.visible');

    cy.get('nav.sk-sidemenu label').contains('Avbildning').should('be.visible');
    cy.get('nav.sk-sidemenu label').contains('Bolag').should('be.visible');

    cy.contains('select', 'Masterdata').should('be.visible');
    cy.contains('select', 'Sundsvalls kommun').should('be.visible');
  });

  it('should change company', () => {
    cy.intercept('GET', '**/api/mdviewer/organization/14/orgtree/0', orgTreeResponse).as('getOrgTree');
    cy.get('select[name="sidemenu-company"]').select('Mittuniversitetet');
    cy.wait('@getOrgTree');
    cy.get('@getOrgTree.all').should('have.length', 1);
  });

  it('should change image', () => {
    cy.intercept('GET', '**/api/mdviewer/organization/13/orgtree/1', orgTreeResponse).as('getOrgTree');
    cy.get('select[name="sidemenu-image"]').select('HR');
    cy.wait('@getOrgTree');
    cy.get('@getOrgTree.all').should('have.length', 1);
  });

  it('should display menu-body content', () => {
    cy.get('.sk-sidemenu-body').should('be.visible');

    const menuLabels = [
      'Barn o utbildningsförvaltning',
      'Miljökontoret',
      'Stadsbyggnadskontoret',
      'Lantmäterikontoret',
      'Överförmyndarkontoret',
      'Kultur och fritid',
      'Individ och arbetsmarknadsförv',
    ];

    menuLabels.forEach((label) => {
      cy.get('.sk-sidemenu-body .sk-sidemenu-item-link').contains(label).should('exist');
    });

    cy.get('.sk-sidemenu-body > li')
      .should('have.length', menuLabels.length)
      .each(($menuItem) => {
        cy.wrap($menuItem).find('.sk-sidemenu-item-link').should('have.attr', 'aria-expanded', 'false');
      });
  });

  it('should display expanded content when expand button is clicked', () => {
    cy.intercept('GET', '**/api/mdviewer/organization/*', organization);
    cy.intercept('GET', '**/api/mdviewer/responsibility/**/responsibilitysallleaves', responsibilities);
    cy.intercept('GET', '**/api/mdviewer/operation/**/operationallleaves', operations);
    cy.intercept('GET', '**/api/mdviewer/employment/**/employeesallleaves', employees);

    cy.get('.sk-sidemenu-item .sk-sidemenu-item-link').first().click();

    cy.get('.items .sk-sidemenu-item .sk-sidemenu-item-link').contains('BOU Norra grundskola').should('exist');
    cy.get('.items .sk-sidemenu-item .sk-sidemenu-item-link').contains('BOU Norra grundskola').click();

    cy.get(`.sk-sidemenu-item.lvl-2[data-id="37"]`).find('.sk-sidemenu-item-link').first().click();

    cy.get('.sk-sidemenu-item-link').contains('BOU NG Bosvedjeskolan').click();

    cy.get('.sk-sidemenu-item.lvl-4[data-id="180"]')
      .find('.sk-sidemenu-item-link')
      .first()
      .contains('BOU NG Bosvedjeskolan')
      .should('exist');

    cy.get('.sk-sidemenu-body .sk-sidemenu-item-link').first().should('have.attr', 'aria-expanded', 'true');
  });

  it('Testing sorting of zebraTable rows', () => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/**/responsibilitysallleaves', responsibilities);
    cy.intercept('GET', '**/api/mdviewer/operation/**/operationallleaves', operations);
    cy.intercept('GET', '**/api/mdviewer/employment/**/employeesallleaves', employees);
    cy.get('.sk-sidemenu-body .sk-sidemenu-item .expand').first().click();

    cy.get('.items .sk-sidemenu-item .sk-sidemenu-item-link').contains('BOU Norra grundskola').should('exist');
    cy.get('.items .sk-sidemenu-item .sk-sidemenu-item-link').contains('BOU Norra grundskola').click();

    // Ensure the first row contains 'Förstelärare (Sundsvalls kommun)'
    cy.get('tbody.sk-zebratable-tbody tr:first-child').contains('Förstelärare (Sundsvalls kommun)').should('exist');

    // Click the sorting button
    cy.get('button').filter(':visible').contains('Anställning').click();

    // Check that the first row now contains 'Barnskötare (Sundsvalls kommun)'
    cy.get('tbody.sk-zebratable-tbody tr:first-child').contains('Barnskötare (Sundsvalls kommun)').should('exist');
  });
});
