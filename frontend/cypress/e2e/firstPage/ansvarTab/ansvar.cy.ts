import { responsibilities } from '../../../fixtures/responsibilities';
import { responsibilitiesCompany2 } from '../../../fixtures/responsibilities_company2';

describe('/ansvar', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/1/responsibilitysallcompany', responsibilities).as(
      'responsibilities'
    );
    cy.intercept('POST', '**/api/feedback', { data: true, message: 'ok' }).as('postFeedback');

    cy.visit('/');

    // Switch to Ansvar tab
    cy.get('.sk-tab-menu-item').contains('Ansvar').click();
  });

  it('Change company', () => {
    cy.intercept('GET', '**/api/mdviewer/responsibility/2/responsibilitysallcompany', responsibilitiesCompany2).as(
      'responsibilities'
    );
    cy.get('#responsibilities-listfilter-company').should('be.visible');
    cy.get('#responsibilities-listfilter-company').select('Sundsvalls kommun').wait(1000);
    cy.get('.sk-zebratable-tbody').should('exist').find('tr').should('have.length', 3);
    cy.get('#responsibilities-listfilter-company').select('Mittuniversitetet').wait(1000);
    cy.get('.sk-zebratable-tbody').should('exist').find('tr').should('have.length', 1);
  });

  it('Check if the search result appears', () => {
    cy.get('input[placeholder="Sök i listan"]').type('BoU Pseudo{enter}');

    // Check if the search result appears
    cy.get('td.sk-zebratable-tbody-td').contains('BoU Pseudo').should('exist');

    cy.get('input[placeholder="Sök i listan"]').clear().type('Your search text{enter}');

    // Check if the 'No results' message appears
    cy.get('div.mt-sm.mx-8.px-2').contains('Inga ansvar att visa.').should('exist');
  });

  it('Click on the "Rapportera fel" button', () => {
    cy.contains('button', 'Rapportera fel').click();

    // Check the close button
    cy.get('button[aria-label="Stäng feedback"]').click();
    cy.get('h4[id="headlessui-dialog-title-:rt:"]').should('not.exist');

    // Open the modal again
    cy.contains('button', 'Rapportera fel').click();

    // Select an option from the dropdown
    cy.contains('select', 'Felaktigt ansvar (Ekonomi)').should('be.visible').select('Felaktigt ansvar (Ekonomi)');

    // Type into the text area
    cy.get('textarea[id="body"]').type('This is a test');

    // Clear the text area
    cy.get('textarea[id="body"]').clear();

    // Check if the error message appears
    cy.get('div[id="body-error"]').should('contain', 'Anteckning måste anges');

    // Type again into the text area
    cy.get('textarea[id="body"]').type('This is a test');

    // Check that the text area now contains the correct value
    cy.get('textarea[id="body"]').should('have.value', 'This is a test');

    cy.get('button[type="submit"]').contains('button', 'Rapportera').click();

    cy.wait('@postFeedback').its('response.statusCode').should('eq', 200);

    // Check that the modal has disappeared
    cy.get('button[aria-label="Stäng feedback"]').should('not.exist');
  });

  //   Filter
  it('Filter table columns', () => {
    // Open the dropdown filter
    cy.get('.dropdown-filter button[type="button"]').click();

    // Check if dropdown filter is expanded
    cy.get('.dropdown-filter button[type="button"]').should('have.attr', 'aria-expanded', 'true');

    // Click the 'Visa alla' button
    cy.get('.filter-controls button').contains('Visa alla').click();

    // Check if all checkboxes are checked
    cy.get('.filter-item input[type="checkbox"]').each(($el) => {
      cy.wrap($el).should('be.checked');
    });

    // Check if "Ansvarstyp" header and content exist
    cy.get('.sk-zebratable-thead th').contains('Ansvarstyp').should('exist');
    cy.get('.sk-zebratable-tbody td').contains('Pseudoansvar').should('exist');

    //   Click the 'Dölj alla' button
    cy.get('.filter-controls button').contains('Dölj alla').click();

    // Check if all checkboxes are not checked
    cy.get('.filter-item input[type="checkbox"]')
      .not('[disabled]')
      .each(($el) => {
        cy.wrap($el).should('not.be.checked');
      });

    // Check if "Ansvarstyp" header and content does not exist
    cy.get('.sk-zebratable-thead th').contains('Ansvarstyp').should('not.exist');
    cy.get('.sk-zebratable-tbody td').contains('Pseudoansvar').should('not.exist');

    // Check and uncheck each checkbox
    cy.get('.filter-item input[type="checkbox"]')
      .not('[disabled]')
      .each(($el) => {
        cy.wrap($el).click().should('be.checked');
        cy.wrap($el).click().should('not.be.checked');
      });
  });

  it('Sort table columns', () => {
    // default sorted by Titel
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('BoU Ans').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Titel').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('BoU Pseudo').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Ansvar').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarstyp').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('Pseudoansvar').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('69990000').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Ansvarskod').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('69990002').should('exist');

    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig från').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('1799-12-31').should('exist');
    cy.get('.sk-zebratable-thead th').filter(':visible').contains('button', 'Giltig från').click();
    cy.get('.sk-zebratable-tbody tr').filter(':visible').first().contains('9999-12-31').should('exist');
  });

  // Exportera
  it('tests file download', () => {
    // Find the download link
    cy.get('a[download="allaAnsvar"]').then(($a) => {
      // Extract the href and download attributes
      const href = $a.prop('href');
      const download = $a.attr('download');

      // Check the download attribute is not empty
      expect(download).to.not.be.empty;

      // Check the href attribute is properly formed
      // We expect it to be a Blob URL, which should start with 'blob:'
      expect(href).to.match(/^blob:/);
    });

    // Click the link to initiate the download
    cy.get('a[download="allaAnsvar"]').click();
  });
});
