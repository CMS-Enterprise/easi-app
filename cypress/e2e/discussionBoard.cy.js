describe('Discussion Board', () => {
  it('users with access can interact with discussions', () => {
    // Make sure to seed data before running this test
    // Users are from backend mock data

    // Start a discussion thread as an admin (not participant)
    cy.localLogin({ name: 'ABCD', role: 'EASI_D_GOVTEAM' });

    cy.visit('/it-governance/61efa6eb-1976-4431-a158-d89cc00ce31d/grb-review');

    // Keep the participants list to check against later
    let participants;
    cy.get('[data-testid="grb-participants-table"] td:first-child').then(
      els => {
        participants = Array.from(els, el => el.innerText.trim());
      }
    );

    // Opens modal to view mode
    cy.contains('button', 'View discussion board').click();

    // Continue to start a new discussion
    cy.contains('button', 'Start a new discussion').click();

    // Mention trigger
    cy.get('#mention-discussion').type('@');

    // Check that all participants in the dropdown match the table, + some more groups
    const groups = ['Governance Admin Team', 'Governance Review Board (GRB)'];
    cy.get('#mention-discussion-editorContent button.item').then(els => {
      const dropdownItems = Array.from(els, el => el.innerText.trim());
      // The dropdown will have the participants + some groups
      expect([...participants, ...groups].toSorted()).to.deep.equal(
        dropdownItems.toSorted()
      );
    });

    // Type narrow down to Ally Anderson
    const mentionName = 'Ally Anderson';
    cy.get('#mention-discussion').type('Al');
    cy.contains('#mention-discussion-editorContent button.item', mentionName)
      .as('ally')
      .should('have.length', 1);

    // Select Ally Anderson
    cy.get('@ally').click();

    // Fill out and submit
    const discussionText = 'e2e post 1';
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
      cy.contains('p', `${mentionName} ${discussionText}`);

      // Go to its reply thread
      cy.contains('button', 'Reply').click();

      // Hold onto the reply url to visit later
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

    // Submit a reply
    const replyText = 'e2e post 2';

    cy.get('#mention-reply').type(replyText);
    cy.contains('button', 'Save reply').click();

    // Reply success
    cy.contains('.usa-alert--success', 'Success! Your reply has been added.');
    cy.contains('p', replyText);
    // Empty field after submission
    cy.get('#mention-reply').should('have.text', '');

    // Login with a 3rd visitor and check essential thread data
    cy.get('[data-testid="signout-link"]').click({ force: true });
    cy.localLogin({ name: 'USR4' });
    cy.get('@replyUrl').then(url => cy.visit(url));

    cy.get('[data-testid="discussion-modal"] .easi-discussion-post')
      .eq(0)
      .within(() => {
        cy.contains('p', 'Adeline Aarons');
        cy.contains('h5', 'Governance Admin Team');
        cy.contains('p', `${mentionName} ${discussionText}`);
      });

    cy.get('[data-testid="discussion-modal"] .easi-discussion-post')
      .eq(1)
      .within(() => {
        cy.contains('p', 'User One');
        cy.contains('h5', 'Voting, CMCS Rep');
        cy.contains('p', replyText);
      });
  });
});
