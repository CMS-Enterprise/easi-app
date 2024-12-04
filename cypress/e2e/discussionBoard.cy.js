describe('Discussion Board', () => {
  /*
  - view discussion board
    - start new discussion
    - fill out
    - wait for success
    - see text content
    - reply
    - see content reflected

  - check permalinks
    - go to reply

  - can't access without job code
  */

  it('interacts with discussions', () => {
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
    });

    // todo hold onto reply url

    // Check contents again but this time in reply mode
    cy.contains('p', discussionText);

    // Submit a reply
    const replyText = 'e2e post 2';

    cy.get('#mention-reply').type(replyText);
    cy.contains('button', 'Save reply').click();

    // Reply success
    cy.contains('.usa-alert--success', 'Success! Your reply has been added.');
    cy.contains('p', replyText);

    cy.get('#mention-reply').should('have.text', '');
  });
});
