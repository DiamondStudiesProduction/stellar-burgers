/// <reference types="cypress" />

describe('add ingredients to constructor works correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });
  it('should add ingredient', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('ингредиент 1')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('ингредиент 1')
      .should('exist');
  });
});
describe('should check how modal ingredient works', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });
  it('should open modal window and close him', () => {
    cy.get('[data-cy=bun-ingredients]').contains('ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=icon-close]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
});
describe('order modal should works correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'accessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should check how order works', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=place-an-order]').contains('Оформить заказ').click();

    cy.get('[data-cy=modal]').contains('123456').should('exist');
    cy.get('[data-cy=icon-close]').click();

    cy.get('[data-cy=constructor-filling]')
      .contains('ингредиент 3')
      .should('not.exist');
    cy.get('[data-cy=constructor-filling]')
      .contains('ингредиент 4')
      .should('not.exist');
  });
});
