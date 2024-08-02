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
      linkedTrbRequests(state: OPEN) {
        id
        __typename
      }
      linkedSystemIntakes(state: OPEN) {
        id
        __typename
      }
    }
  }
`;
