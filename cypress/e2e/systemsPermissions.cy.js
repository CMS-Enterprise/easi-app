const easiUser = { name: 'USR1' };
const grtOnlyUser = {
  name: 'GRT1',
  role: 'EASI_D_GOVTEAM',
  allowEasi: false
};
const nonEasiTeamMember = { name: 'ABCD', allowEasi: false };

const system = {
  id: '11AB1A00-1234-5678-ABC1-1A001B00CC0A',
  name: 'Centers for Management Services'
};

const routes = {
  allSystems: '/systems?table-type=all-systems',
  mySystems: '/systems?table-type=my-systems#systemsTable',
  home: '/',
  profile: `/systems/${system.id}/home/top`,
  workspace: `/systems/${system.id}/workspace`,
  workspaceRequests: `/systems/${system.id}/workspace/requests`,
  teamEdit: `/systems/${system.id}/edit/team?workspace`,
  teamMemberAdd: `/systems/${system.id}/edit/team/team-member?workspace`
};

const notFoundHeading = 'This page cannot be found.';
const noMySystemsHeading =
  'You are not listed as a team member for any CMS systems';
const workspaceHeading = 'System workspace';

const loginAs = user => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.localLogin(user);
};

const interceptSystemOperations = operationNames => {
  cy.intercept('POST', '/api/graph/query', req => {
    operationNames.push(req.body.operationName);

    if (req.body.operationName === 'GetCedarSystems') {
      req.alias = 'getCedarSystems';
    }

    if (req.body.operationName === 'GetCedarSystemIsBookmarked') {
      req.alias = 'getCedarSystemIsBookmarked';
    }

    if (req.body.operationName === 'GetMyCedarSystems') {
      req.alias = 'getMyCedarSystems';
    }

    if (req.body.operationName === 'GetSystemProfile') {
      req.alias = 'getSystemProfile';
    }

    if (req.body.operationName === 'GetSystemWorkspace') {
      req.alias = 'getSystemWorkspace';
    }

    if (req.body.operationName === 'GetSystemWorkspaceAto') {
      req.alias = 'getSystemWorkspaceAto';
    }

    if (req.body.operationName === 'GetLinkedRequests') {
      req.alias = 'getLinkedRequests';
    }

    if (req.body.operationName === 'GetCedarRoleTypes') {
      req.alias = 'getCedarRoleTypes';
    }

    if (req.body.operationName === 'CreateCedarSystemBookmark') {
      req.alias = 'createCedarSystemBookmark';
    }

    if (req.body.operationName === 'DeleteCedarSystemBookmark') {
      req.alias = 'deleteCedarSystemBookmark';
    }
  });
};

const waitForBookmarkMutation = initialBookmarked => {
  cy.wait(
    initialBookmarked
      ? '@deleteCedarSystemBookmark'
      : '@createCedarSystemBookmark'
  )
    .its('response.statusCode')
    .should('eq', 200);
};

const assertNoLegacyBookmarkRefetch = operationNames => {
  cy.then(() => {
    expect(operationNames).not.to.include('GetCedarSystemIsBookmarked');
  });
};

describe('Systems permissions', () => {
  it('lets an EASi user navigate from the systems directory to a system profile', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(easiUser);

    cy.visit(routes.allSystems);
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);

    cy.contains('a', system.name)
      .should('have.attr', 'href')
      .and('include', '/home/top');

    cy.contains('a', system.name).click();

    cy.wait('@getSystemProfile').then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body?.data?.cedarSystemDetails?.cedarSystem?.id).to.eq(
        system.id
      );
      expect(
        response?.body?.data?.cedarSystemDetails?.deployments
      ).to.have.length.greaterThan(0);
      expect(
        response?.body?.data?.cedarSystemDetails?.urls
      ).to.have.length.greaterThan(0);
    });
    cy.url().should('include', routes.profile);
    cy.contains('h1', system.name).should('be.visible');
    cy.contains('h2', 'URLs and locations').should('be.visible');
    cy.get(
      '[data-testid="is-bookmarked"], [data-testid="is-not-bookmarked"]'
    ).should('be.visible');

    cy.then(() => {
      expect(operationNames).to.include('GetCedarSystems');
      expect(operationNames).to.include('GetSystemProfile');
    });
  });

  it('toggles a profile bookmark without refetching cedarSystem', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(easiUser);

    cy.visit(routes.profile);
    cy.wait('@getSystemProfile').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="is-bookmarked"], [data-testid="is-not-bookmarked"]')
      .should('be.visible')
      .then($icon => {
        const initialBookmarked = $icon.attr('data-testid') === 'is-bookmarked';

        cy.wrap($icon).closest('button').click();

        waitForBookmarkMutation(initialBookmarked);
        cy.get(
          initialBookmarked
            ? '[data-testid="is-not-bookmarked"]'
            : '[data-testid="is-bookmarked"]'
        ).should('be.visible');
      });

    cy.then(() => {
      expect(
        operationNames.some(operationName =>
          ['CreateCedarSystemBookmark', 'DeleteCedarSystemBookmark'].includes(
            operationName
          )
        )
      ).to.eq(true);
    });
    assertNoLegacyBookmarkRefetch(operationNames);
  });

  it('shows the empty My systems state for an EASi user with no team memberships', () => {
    interceptSystemOperations([]);
    loginAs(easiUser);

    cy.visit(routes.mySystems);
    cy.wait('@getMyCedarSystems').its('response.statusCode').should('eq', 200);
    cy.contains(noMySystemsHeading).should('be.visible');
  });

  it('lets a GRT-only user browse the systems directory without clickable system links', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(grtOnlyUser);

    cy.visit(routes.allSystems);
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);

    cy.contains('tbody th', system.name).should('be.visible');
    cy.get('tbody a[href*="/systems/"]').should('not.exist');

    cy.then(() => {
      expect(operationNames).to.include('GetCedarSystems');
      expect(operationNames).not.to.include('GetSystemProfile');
      expect(operationNames).not.to.include('GetSystemWorkspace');
    });
  });

  it('lets a GRT-only user bookmark from the systems directory without a cedarSystem refetch', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(grtOnlyUser);

    cy.visit(routes.allSystems);
    cy.wait('@getCedarSystems').its('response.statusCode').should('eq', 200);

    cy.contains('tbody tr', system.name).within(() => {
      cy.get('button[aria-label="Bookmark"]').click();
      cy.get('button[aria-label="Bookmarked"]').should('be.visible');
    });

    cy.wait('@createCedarSystemBookmark')
      .its('response.statusCode')
      .should('eq', 200);

    cy.contains('button', 'Bookmarked systems').click();
    cy.contains('tbody th', system.name).should('be.visible');

    assertNoLegacyBookmarkRefetch(operationNames);
  });

  it('shows the empty My systems state for a GRT-only user', () => {
    interceptSystemOperations([]);
    loginAs(grtOnlyUser);

    cy.visit(routes.mySystems);
    cy.wait('@getMyCedarSystems').its('response.statusCode').should('eq', 200);
    cy.contains(noMySystemsHeading).should('be.visible');
  });

  it('blocks direct profile and workspace routes for a GRT-only user', () => {
    interceptSystemOperations([]);
    loginAs(grtOnlyUser);

    cy.visit(routes.profile);
    cy.contains('h1', notFoundHeading).should('be.visible');

    cy.visit(routes.workspace);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });

  it('shows workspace links in the homepage My systems widget for a non-EASi team member', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(nonEasiTeamMember);

    cy.wait('@getMyCedarSystems').its('response.statusCode').should('eq', 200);
    cy.contains('h2', 'My systems').should('be.visible');
    cy.contains('a', system.name)
      .should('have.attr', 'href')
      .and('include', '/workspace');

    cy.then(() => {
      expect(operationNames).to.include('GetMyCedarSystems');
      expect(operationNames).not.to.include('GetCedarSystems');
    });
  });

  it('lets a non-EASi team member open the workspace route from the homepage widget', () => {
    interceptSystemOperations([]);
    loginAs(nonEasiTeamMember);

    cy.contains('a', system.name).click();

    cy.wait('@getSystemWorkspace').its('response.statusCode').should('eq', 200);
    cy.url().should('include', routes.workspace);
    cy.contains('h1', workspaceHeading).should('be.visible');
    cy.contains(`for ${system.name}`).should('be.visible');
    cy.contains('button', 'View system profile').should('not.exist');
    cy.get(
      '[data-testid="is-bookmarked"], [data-testid="is-not-bookmarked"]'
    ).should('be.visible');
  });

  it('lets a non-EASi team member toggle the workspace bookmark without a cedarSystem refetch', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(nonEasiTeamMember);

    cy.contains('a', system.name).click();
    cy.wait('@getSystemWorkspace').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="is-bookmarked"], [data-testid="is-not-bookmarked"]')
      .should('be.visible')
      .then($icon => {
        const initialBookmarked = $icon.attr('data-testid') === 'is-bookmarked';

        cy.wrap($icon).closest('button').click();

        waitForBookmarkMutation(initialBookmarked);
        cy.get(
          initialBookmarked
            ? '[data-testid="is-not-bookmarked"]'
            : '[data-testid="is-bookmarked"]'
        ).should('be.visible');
      });

    assertNoLegacyBookmarkRefetch(operationNames);
  });

  it('lets a non-EASi team member open the workspace requests page from the workspace', () => {
    interceptSystemOperations([]);
    loginAs(nonEasiTeamMember);

    cy.contains('a', system.name).click();
    cy.wait('@getSystemWorkspace').its('response.statusCode').should('eq', 200);

    cy.contains('a', 'View all requests').click();

    cy.wait('@getLinkedRequests').its('response.statusCode').should('eq', 200);
    cy.url().should('include', routes.workspaceRequests);
    cy.contains('h1', 'Requests').should('be.visible');
    cy.contains('for Easy Access to System Information').should('be.visible');
    cy.getByTestId('system-linked-requests').should('be.visible');
  });

  it('lets a non-EASi team member manage team routes from the workspace', () => {
    const operationNames = [];

    interceptSystemOperations(operationNames);
    loginAs(nonEasiTeamMember);

    cy.contains('a', system.name).click();
    cy.wait('@getSystemWorkspace').its('response.statusCode').should('eq', 200);

    cy.contains('a', 'Manage system team').click();

    cy.url().should('include', routes.teamEdit);
    cy.contains('h1', 'Manage system team').should('be.visible');

    cy.contains('button', 'Add another team member').click();

    cy.wait('@getCedarRoleTypes').its('response.statusCode').should('eq', 200);
    cy.url().should('include', routes.teamMemberAdd);
    cy.contains('h1', 'Add a team member').should('be.visible');

    cy.then(() => {
      expect(operationNames).not.to.include('GetSystemProfile');
      expect(operationNames).to.include('GetSystemWorkspace');
      expect(operationNames).to.include('GetCedarRoleTypes');
    });
  });

  it('blocks the system profile route for a non-EASi team member', () => {
    interceptSystemOperations([]);
    loginAs(nonEasiTeamMember);

    cy.visit(routes.profile);
    cy.contains('h1', notFoundHeading).should('be.visible');
  });
});
