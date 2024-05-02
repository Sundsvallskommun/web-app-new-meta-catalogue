import { orgChangeEmployees } from '../../../../../fixtures/orgchange/employees';
import { orgChangeOperations } from '../../../../../fixtures/orgchange/operations';
import { orgTreeLevel6 } from '../../../../../fixtures/orgchange/orgTreeLevel6';
import { orgChangeResponsibilities } from '../../../../../fixtures/orgchange/responsibilities';
import { beforeEachDraft } from '../../../../../helpers/orgchange/beforeEachDraft';

describe('/hanteraorganisation - main - Tabs - Responsibilities', () => {
  beforeEach(() => {
    beforeEachDraft({
      orgTree: orgTreeLevel6,
      intercepts: () => {
        cy.intercept('GET', '**/api/orgchange/operation/organization/**', {
          data: orgChangeOperations,
          message: 'success',
        }).as('getOperations');
        cy.intercept('GET', '**/api/orgchange/employment/**', { data: orgChangeEmployees, message: 'success' }).as(
          'getEmployees'
        );
        cy.intercept('GET', '**/api/orgchange/responsibility/**', {
          data: orgChangeResponsibilities,
          message: 'success',
        }).as('getResponsibilities');
      },
    });
    cy.get('aside button').contains('Uslands skola').click();
    cy.wait('@getResponsibilities');
    cy.get('main [role="tablist"]').contains('Kopplade ansvar (3)').click();
  });

  it('Search responsibility', () => {
    cy.get('#sk-tab-panel-1-responsibilities').find('table tbody tr').should('have.length', 3);

    cy.get('#sk-tab-panel-1-responsibilities').find('input[placeholder="Sök i listan"]');
    cy.get('#sk-tab-panel-1-responsibilities').find('input[placeholder="Sök i listan"]').click();
    cy.get('#sk-tab-panel-1-responsibilities').find('input[placeholder="Sök i listan"]').type('pseudo Bob');

    cy.get('#sk-tab-panel-1-responsibilities').find('table tbody tr').should('have.length', 1);
  });

  it('Filter table columns', () => {
    cy.get('#sk-tab-panel-1-responsibilities').contains('Visa/dölj kolumner i ansvar').click();

    // Click the "Dölj alla" button
    cy.get('button[type="button"]').contains('Dölj alla').click();
    // Check if zebratable header and content have disappeared
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarskod').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('41203001').should('not.exist');
    // And if the appers again..
    cy.get('button[type="button"]').contains('Visa alla').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarskod').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('41203001').should('exist');

    // All visible

    cy.get('.dropdown-filter').contains('label', 'Titel').find('input').should('have.attr', 'aria-disabled', 'true');

    // checking Bob Miller
    cy.get('.dropdown-filter').contains('label', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarstyp').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Pseudoansvar').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Ansvarstyp').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Pseudoansvar').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Giltig från').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Giltig från').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('1900-01-01').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Giltig från').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Giltig från').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('1900-01-01').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Giltig till').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Giltig till').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('9999-12-31').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Giltig till').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Giltig till').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('9999-12-31').should('exist');

    cy.get('.dropdown-filter').contains('label', 'Status').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Status').should('not.exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Aktiv').should('not.exist');
    cy.get('.dropdown-filter').contains('label', 'Status').click();
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('Status').should('exist');
    cy.get('.sk-zebratable-tbody td').filter(':visible').contains('Aktiv').should('exist');

    cy.get('.dropdown-filter')
      .contains('label', 'Redigera ansvar')
      .find('input')
      .should('have.attr', 'aria-disabled', 'true');
  });

  it('Sort table columns', () => {
    // default sorted by Namn
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Bob').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Titel').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('pseudo Bob').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Ansvar').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Pseudoansvar').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('41203000').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('41203002').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig från').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('1900-01-01').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig från').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('1900-01-03').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig till').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('9999-12-31').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig till').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('99999-12-31').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Status').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Aktiv').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Status').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Inaktiv').should('exist');
  });

  it('Create responsibility', () => {
    cy.intercept('POST', '**/api/orgchange/responsibility', { data: true, message: 'success' }).as(
      'postNewResponsibility'
    );
    // assumption 000 is Löneansvar
    cy.intercept('GET', '**/api/orgchange/responsibility/**/newcode?responsibilityType=L%C3%96NEANSVAR', {
      data: '94000000',
      message: 'success',
    }).as('getNewRespCode');
    // assumption 001 is Ansvar
    cy.intercept('GET', '**/api/orgchange/responsibility/**/newcode?responsibilityType=ANSVAR', {
      data: '94000001',
      message: 'success',
    }).as('getNewRespCodeAnsvar');

    cy.get('button').filter(':visible').contains('Skapa nytt ansvar').click();

    cy.wait('@getNewRespCode');

    cy.get('div[aria-modal="true"] label').filter(':visible').contains('Ansvartitel').click();
    cy.focused().type('Nytt ansvar');

    // default Löneansvar
    cy.get('div[aria-modal="true"] label').filter(':visible').contains('Ansvarskod').click();
    cy.focused().should('have.value', '000');
    cy.get('#responsibilityTypeId option:selected').should('have.text', 'Löneansvar');

    // change to Ansvar
    cy.get('div[aria-modal="true"] label').contains('Ansvarskod').click();
    cy.focused().invoke('val', '');
    cy.focused().type('002');
    cy.focused().should('have.value', '002');

    cy.get('select#responsibilityTypeId').select('Ansvar');

    cy.wait('@getNewRespCodeAnsvar');

    cy.get('div[aria-modal="true"] label').contains('Ansvarskod').click();
    cy.focused().should('have.value', '001');

    cy.get('div[aria-modal="true"] button').contains('Spara').click();

    cy.wait('@postNewResponsibility');

    cy.get('div').contains('Ansvaret har sparats').should('be.visible');
  });

  it('Change name on responsibility', () => {
    cy.intercept('PUT', '**/api/orgchange/responsibility/rename', { data: true, message: 'success' }).as(
      'putRenameResponsibility'
    );

    cy.get('button[title="Öppna ansvaret"]').first().click();
    cy.get('div[aria-modal="true"] label').contains('Ansvartitel').click();
    cy.focused().clear();
    cy.focused().type('Ny ansvarstitel');
    cy.focused().should('have.value', 'Ny ansvarstitel');

    cy.get('div[aria-modal="true"] button').contains('Spara').click();

    cy.get('div').contains('Ansvaret har sparats').should('be.visible');
  });

  it('Remove responsibility', () => {
    cy.intercept('PUT', '**/api/orgchange/responsibility/close', { data: true, message: 'success' }).as(
      'putCloseResponsibility'
    );
    cy.get('button[title="Öppna ansvaret"][aria-label="löneansvar Bob"]').click();

    cy.get('button').contains('Ta bort ansvar').click();

    cy.get('h1').contains('Är du säker på att du vill ta bort ansvaret?').should('be.visible');

    cy.get('button').contains('Ja, ta bort ansvaret').click();

    cy.get('div').contains('Ansvaret har tagits bort').should('be.visible');
  });
});
