describe('dashboard page', () => {
  beforeEach(() => {
    cy.visit('https://agricreds-react-app.vercel.app/dashboard')
  })
  it('should load the dashboard page', () => {
    cy.contains('Dashboard').should('be.visible');
  })
    it('should display total borrowers', () => {
        cy.get('.card').contains('Total Borrowers').should('be.visible');
    })
    it('should display disbursed amount', () => {
        cy.get('.card').contains('Disbursed Amount').should('be.visible');
    })
    it('should display repayment amount', () => {
        cy.get('.card').contains('Repayment').should('be.visible');
    })
    it('should display outstanding amount', () => {
        cy.get('.card').contains('Outstanding Amount').should('be.visible');
    })
    it('should display a bar chart for general data', () => {
        cy.get('.bar-chart').should('be.visible');
    })
    it('should display a pie chart for credit score data', () => {
        cy.get('.pie-chart').should('be.visible');
    })
    it('should display loading text when data is being fetched', () => {
        cy.contains('Loading dashboard data...').should('be.visible');
    })
    it('should display the dashboard title', () => {
        cy.get('h1').should('contain', 'Dashboard');
    })
    it('should display the total borrowers count', () => {
        cy.get('.card').contains('Total Borrowers').next().should('not.be.empty');
    })
    it('should display the disbursed amount in RWF', () => {
        cy.get('.card').contains('Disbursed Amount').next().should('not.be.empty');
    })
    it('should display the repayment amount in RWF', () => {
        cy.get('.card').contains('Repayment').next().should('not.be.empty');
    })
    it('should display the outstanding amount in RWF', () => {
        cy.get('.card').contains('Outstanding Amount').next().should('not.be.empty');
    })
    it('should display the bar chart with data', () => {
        cy.get('.bar-chart canvas').should('exist');
    })
    it('should have a card for each data point', () => {
        cy.get('.card').should('have.length', 4);
    })
    it('should have a consistent layout', () => {
        cy.get('.dashboard-container').should('have.class', 'dashboard-container');
        cy.get('.cards').should('have.class', 'cards');
        cy.get('.charts-container').should('have.class', 'charts-container');
    })
   it('renders Bar chart when data available', () => {
    cy.get('.bar-chart').within(() => {
      cy.contains('Summary: Disbursed, Repayment & Outstanding');
      cy.get('canvas').should('exist');
      cy.contains('No data available.').should('not.exist');
    });
  });
    it('renders Pie chart when data available', () => {
        cy.get('.pie-chart').within(() => {
            cy.get('canvas').should('exist');
            cy.contains('No data available.').should('not.exist');
        });
    });
})