import { gql } from '@apollo/client';

export default gql`
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
      linkedTrbRequests(state: OPEN) {
        id
      }
      linkedSystemIntakes(state: OPEN) {
        id
      }
    }
  }
`;
