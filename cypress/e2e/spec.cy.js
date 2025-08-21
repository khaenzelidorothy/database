describe('welcome page', () => {
  beforeEach(() => {
    cy.visit('https://agricreds-react-app.vercel.app/')
  })
  it('should load the homepage', () => {
    cy.contains('Welcome to Agricreds').should('be.visible');
  })
  it('should navigate to the sign-in page when "Get Started" is clicked', () => {
    cy.get('.button1').click();
    cy.url().should('include', '/signin');
  })
  it('should display the welcome image', () => {
    cy.get('.welcome-image').should('be.visible');
  })  
  it('should display the welcome text', () => {
    cy.get('.welcome-text').should('contain', 'Welcome to Agricreds');
  })
  it('should display the subheading text', () => {
    cy.get('h2').should('contain', 'Track your loan fast and quick');
  })
  it('should have a button with the text "Get Started"', () => {
    cy.get('.button1').should('contain', 'Get Started');
  })
})

describe('sign in page', () => {
  beforeEach(() => {
    cy.visit('https://agricreds-react-app.vercel.app/signin')
  })
  it('should load the sign-in page', () => {
    cy.contains('Sign In').should('be.visible');
  })
  it('should have a form with phonenumber and password fields', () => {
    cy.get('form').should('exist');
    cy.get('input[type="text"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  })
  it('should have a submit button', () => {
    cy.get('button[type="submit"]').should('exist');
  })
  it('should allow user to enter phone number', () => {
    cy.get('#phone_number').type('0734567890').should('have.value', '0734567890');
  })
  it('should allow user to enter password', () => {
    cy.get('#password').type('password123').should('have.value', 'password123');
  })
  it('should toggle password visibility when the icon is clicked', () => {
    cy.get('.password-toggle').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.get('.password-toggle').click();
    cy.get('#password').should('have.attr', 'type', 'password');
  })
  it('should display loading text when form is submitted', () => {
    cy.get('#phone_number').type('0734567890');
    cy.get('#password').type('password123');
    cy.get('form').submit();
    cy.contains('Loading...').should('be.visible');
  })
  it('should display error message on failed login', () => {
    cy.get('#phone_number').type('invalid_phone');
    cy.get('#password').type('wrong_password');
    cy.get('form').submit();
    cy.contains('Error:').should('be.visible');
  })
  it('should navigate to the dashboard on successful login', () => {
    cy.get('#phone_number').type('0791840888');
    cy.get('#password').type('hjfda78j$');
    cy.get('form').submit();
    cy.url().should('include', '/dashboard'); 
  })
})

