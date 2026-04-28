const localAuthHeader = ({ name, role, allowEasi = true }) => ({
  Authorization: `Local ${JSON.stringify({
    euaId: name,
    jobCodes: role ? [role] : [],
    favorLocalAuth: true,
    allowEasi
  })}`
});

describe('CEDAR permissions', () => {
  it('lets an EASI user query cedar systems', () => {
    cy.request({
      method: 'POST',
      url: '/api/graph/query',
      headers: localAuthHeader({ name: 'USR1' }),
      body: {
        operationName: 'GetCedarSystemsPermissionCheck',
        query: `
          query GetCedarSystemsPermissionCheck {
            cedarSystems {
              id
            }
          }
        `
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(200);
      expect(body.errors).to.equal(undefined);
      expect(body.data.cedarSystems).to.be.an('array');
    });
  });

  it('blocks a non-EASI user from querying cedar systems', () => {
    cy.request({
      method: 'POST',
      url: '/api/graph/query',
      failOnStatusCode: false,
      headers: localAuthHeader({ name: 'USR1', allowEasi: false }),
      body: {
        operationName: 'GetCedarSystemsPermissionCheck',
        query: `
          query GetCedarSystemsPermissionCheck {
            cedarSystems {
              id
            }
          }
        `
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(200);
      expect(body.data).to.equal(null);
      expect(body.errors[0].message).to.contain('User is unauthorized');
    });
  });

  it('blocks a non-EASI user from querying cedar contact lookup', () => {
    cy.request({
      method: 'POST',
      url: '/api/graph/query',
      failOnStatusCode: false,
      headers: localAuthHeader({ name: 'USR1', allowEasi: false }),
      body: {
        operationName: 'GetCedarContactsPermissionCheck',
        query: `
          query GetCedarContactsPermissionCheck {
            cedarPersonsByCommonName(commonName: "AB") {
              euaUserId
            }
          }
        `
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(200);
      expect(body.data).to.equal(null);
      expect(body.errors[0].message).to.contain('User is unauthorized');
    });
  });
});
