import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMyCedarSystems {
    myCedarSystems {
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
      linkedSystemIntakes(state: OPEN) {
        id
      }
      linkedTrbRequests(state: OPEN) {
        id
      }
    }
  }
`);
