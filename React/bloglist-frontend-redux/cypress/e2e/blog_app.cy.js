describe('Blog app', function () {
  beforeEach(function () {
    // Reset the db
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // Create a new user into the db
    const user = {
      name: 'Test User',
      username: 'tester',
      password: 'salis',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);

    // Go to the app
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      // Input correct credentials into the login-form and submit it
      cy.get('#username').type('tester');
      cy.get('#password').type('salis');
      cy.get('#login-button').click();

      // Check that the user is now logged in
      cy.contains('Test User logged in');
    });

    it('fails with wrong credentials', function () {
      // Input wrong credentials into the login-form and submit it
      cy.get('#username').type('tester');
      cy.get('#password').type('wrongpw');
      cy.get('#login-button').click();

      // Check that an error is displayed correctly
      cy.get('#danger')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(132, 32, 41)')
        .and('have.css', 'border-style', 'solid');

      // Check that there is no user logged in
      cy.get('html').should('not.contain', 'Test User logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      // Log the user in
      cy.login({ username: 'tester', password: 'salis' });
    });

    it('A blog can be created', function () {
      // Get and click the 'New blog'-button
      cy.get('#new-blog').click();

      // Type blogs info into the form and submit it
      cy.get('#title').type('Test blog from Cypress');
      cy.get('#author').type('Cypress');
      cy.get('#url').type('https://docs.cypress.io');
      cy.get('#submitBlog').click();

      // Check that the blog exists
      cy.contains('Test blog from Cypress, Cypress');
    });
  });

  describe('When one blog exists', function () {
    beforeEach(function () {
      // Login and create a blog using cypress commands
      cy.login({ username: 'tester', password: 'salis' });
      cy.createBlog({
        title: 'Test blog from Cypress',
        author: 'Cypress',
        blogUrl: 'https://docs.cypress.io',
      });
    });

    it('it can be opened', function () {
      // Get and click the name of the blog
      cy.contains('Test blog from Cypress, Cypress').click();
      cy.contains('Test blog from Cypress');
      cy.contains('0 likes');
      cy.contains('Added by');
      cy.contains('Test User');
    });

    it('it can be liked', function () {
      // Get and click the name of the blog to open detailed view
      cy.contains('Test blog from Cypress, Cypress').click();

      // Check that there are no likes at the start
      cy.contains('0 likes');

      // Get and click the 'Like'-button
      cy.get('#like').click();

      // Check that there is now one like
      cy.contains('1 likes');
    });

    it('the user who posted the blog can delete it', function () {
      // Get and click the name of the blog to open detailed view
      cy.contains('Test blog from Cypress, Cypress').click();

      // Get the delete-button and click it
      cy.get('#delete-blog').click();

      // Check that a notification is displayed correctly
      cy.get('#success')
        .should('contain', 'Deleted blog "Test blog from Cypress" by Cypress')
        .and('have.css', 'color', 'rgb(15, 81, 50)')
        .and('have.css', 'border-style', 'solid');

      // go back to the frontpage where the list of blogs is
      cy.visit('http://localhost:3000');

      // Wait a bit, so the page can render
      cy.wait(500);

      // Check that the blog no longer exists
      cy.get('html').should('not.contain', 'Test blog from Cypress, Cypress');
    });
  });

  describe('When multiple blogs from multiple users exist', function () {
    beforeEach(function () {
      // Create a second user into the db
      const user = {
        name: 'Test User2',
        username: 'tester2',
        password: 'salis2',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', user);

      // Login and create a blog for one user
      cy.login({ username: 'tester', password: 'salis' });
      cy.createBlog({
        title: 'Test blog from Cypress',
        author: 'Cypress',
        blogUrl: 'https://docs.cypress.io',
      });

      // Login and create a blog using different user
      cy.login({ username: 'tester2', password: 'salis2' });
      cy.createBlog({
        title: 'Test blog from another user',
        author: 'Cypress',
        blogUrl: 'https://docs.cypress.io',
      });
    });

    it('Only the user who posted the blog can see the Remove-button', function () {
      // Get and click the 'View'-button of the blog that was created by the user not currently logged in
      cy.contains('Test blog from Cypress, Cypress').as('firstBlog').click();

      // Check that the blog doesn't contain the current logged in users name
      cy.contains('Added by Test User2').should('not.exist');

      // Wait a bit, so the like can render
      cy.wait(500);

      // Check that the blog doesn't have the remove-button
      cy.get('#delete-blog').should('not.exist');

      // go back to the frontpage where the list of blogs is
      cy.visit('http://localhost:3000');

      // Wait a bit, so the page can render
      cy.wait(500);

      // Get and click the 'View'-button of the blog that was created by the user currently logged in
      cy.contains('Test blog from another user, Cypress').click();

      // Check that the blog contains the current logged in users name
      cy.contains('Added by');
      cy.contains('Test User2');

      // Check that the blog contains remove-button
      cy.get('#delete-blog');
    });
  });
});
