beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
    'ingredients'
  );

  cy.visit('http://localhost:4000/');

  cy.wait('@ingredients');
});

describe('Проверка работы конструктора', () => {
  it('Проверка добавления булки по клику', () => {
    cy.get('h3')
      .contains('Булки')
      .next('ul')
      .children()
      .first()
      .contains('Добавить')
      .click();

    cy.get('[data-cy="burger-constructor-section"]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });
});
