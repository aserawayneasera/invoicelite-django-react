describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login')
  })

  it('shows the login form', () => {
    cy.contains('InvoiceLite')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('logs in with valid credentials', () => {
    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('shows error for invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@test.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid email or password')
  })
})
