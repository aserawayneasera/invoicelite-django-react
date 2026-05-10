describe('Clients', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('http://localhost:5173/login')
    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.visit('http://localhost:5173/clients')
  })

  it('creates a new client', () => {
    cy.contains('New Client').click()
    cy.get('input[placeholder="Name *"]').type('Acme Corp')
    cy.get('input[placeholder="Email"]').type('acme@example.com')
    cy.contains('Save').click()
    cy.contains('Acme Corp').should('be.visible')
  })
})
