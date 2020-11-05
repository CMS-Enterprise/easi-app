import { gql } from '@apollo/client';

export default gql`
  query GetProjects {
    projects {
      id
      name
    }
  }
`;
