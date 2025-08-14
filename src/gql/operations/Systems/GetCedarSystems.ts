import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSystems {
    cedarSystems {
      id
      name
      description
      acronym
      status
      businessOwnerOrg
      businessOwnerOrgComp
      systemMaintainerOrg
      systemMaintainerOrgComp
      isBookmarked
      atoExpirationDate
      oaStatus
      linkedTrbRequests(state: OPEN) {
        id
      }
      linkedSystemIntakes(state: OPEN) {
        id
      }
    }
  }
`);
