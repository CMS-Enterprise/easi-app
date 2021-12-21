import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystems {
    cedarSystems {
      id
      name
      acronym
      businessOwnerOrg
    }
  }
`;
