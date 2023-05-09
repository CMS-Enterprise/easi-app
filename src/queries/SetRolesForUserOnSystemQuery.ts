import { gql } from '@apollo/client';

export default gql`
  mutation SetRolesForUserOnSystem($input: SetRolesForUserOnSystemInput!) {
    setRolesForUserOnSystem(input: $input)
  }
`;
