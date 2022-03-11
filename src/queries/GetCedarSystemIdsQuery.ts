import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystemIds {
    cedarSystems {
      id
      name
    }
  }
`;
