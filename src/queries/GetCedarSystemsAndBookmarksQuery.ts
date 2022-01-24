import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystemsAndBookmarks {
    cedarSystemBookmarks {
      euaUserId
      cedarSystemId
    }
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
    }
  }
`;
