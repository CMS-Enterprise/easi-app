describe('Discussion Board', () => {
  it('users with access can interact with discussions', () => {
    // Make sure to seed data before running this test
    // Users are from backend mock data

    // Start a discussion thread as an admin (not participant)
    cy.localLogin({ name: 'ABCD', role: 'EASI_D_GOVTEAM' });

    cy.visit('/it-governance/61efa6eb-1976-4431-a158-d89cc00ce31d/grb-review');

    // Opens modal to view mode
    cy.contains('button', 'View discussion board').click();

    // Continue to start a new discussion
    cy.contains('button', 'Start a new discussion').click();

    // Fill out and submit
    const discussionText = 'e2e post 1';

    // todo mention trigger

    cy.get('#mention-discussion').type(discussionText);
    cy.contains('button', 'Save discussion').click();

    // See posted successfully
    cy.contains(
      '.usa-alert--success',
      'You have successfully added to the discussion board.'
    );

    // New posts are at the end
    cy.get('#grbDiscussionsNew li:last-child').within(() => {
      // Check contents
      cy.contains('p', discussionText);

      // Go to its reply thread
      cy.contains('button', 'Reply').click();

      // todo hold onto reply url
      cy.url().as('replyUrl', { type: 'static' });
    });

    // Login as someone not in the participants to make sure they cant access
    cy.get('[data-testid="signout-link"]').click({ force: true });
    cy.localLogin({ name: 'ZZZZ' });
    cy.get('@replyUrl').then(url => cy.visit(url));
    cy.contains('.easi-h1', 'This page cannot be found.');

    // Login as a participant
    cy.get('[data-testid="signout-link"]').click({ force: true });
    cy.localLogin({ name: 'USR1' });
    cy.get('@replyUrl').then(url => cy.visit(url));

    // Check contents of the original post
    cy.contains('p', discussionText);

    // Submit a reply
    const replyText = 'e2e post 2';

    cy.get('#mention-reply').type(replyText);
    cy.contains('button', 'Save reply').click();

    // Reply success
    cy.contains('.usa-alert--success', 'Success! Your reply has been added.');
    cy.contains('p', replyText);
    cy.get('#mention-reply').should('have.text', '');

    // Check the thread contents with yet another user
    cy.get('[data-testid="signout-link"]').click({ force: true });
    cy.localLogin({ name: 'USR4' });
    cy.get('@replyUrl').then(url => cy.visit(url));
    cy.contains('p', discussionText);
    cy.contains('p', replyText);
  });
});
