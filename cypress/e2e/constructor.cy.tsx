// const mockAccessToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmRhMWFhOTdlZGUwMDAxZDA3MGU5MyIsImlhdCI6MTcyMjAxNDI5MSwiZXhwIjoxNzIyMDE1NDkxfQ._BN79AuQJ9j60_ukLu46qsuhGfkkBW9w6BjkMx13XHY"
// const mockRefreshToken = "2711afe825da0bb9e2fcaf63673cfdb286d9ac79a21369cf255b12bc4690e5320e3803540920a57b"

let tokens;

beforeEach(() => {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
    'ingredients'
  );

  cy.fixture('userData').then((data) => {
    tokens = data.auth;
    cy.setCookie('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  });

  cy.visit('http://localhost:4000/');
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

  it('проверка добавления начинки по клику', () => {
    cy.get('h3')
      .contains('Начинки')
      .next('ul')
      .children()
      .first()
      .contains('Добавить')
      .click();

    cy.get('[data-cy="burger-constructor-section"]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });
});

describe('проверка работы модальных окон', () => {
  // Проверяем, что модалка не была открыта изначально
  beforeEach(() => {
    cy.get('#modals').should('be.empty');
  });

  it('проверка открытия модального окна с ингредиентом + проверка совпадения ингредиента по клику и ингредиента в модальном окне', () => {
    cy.get('h3').contains('Начинки').next('ul').children().first().click();

    const expectedData = {
      name: 'Биокотлета из марсианской Магнолии',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242
    };

    cy.get('#modal').within(() => {
      cy.contains(expectedData.name);
      cy.contains(expectedData.calories);
      cy.contains(expectedData.proteins);
      cy.contains(expectedData.fat);
      cy.contains(expectedData.carbohydrates);
    });
  });

  it('проверка отправки заказа', () => {
    cy.get('h3')
      .contains('Булки')
      .next('ul')
      .children()
      .first()
      .contains('Добавить')
      .click();

    cy.get('[data-cy="make-an-order"]')
      .contains('button', 'Оформить заказ')
      .click();
  });
});
