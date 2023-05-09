import { gql } from '@apollo/client';

const CedarRoleType = gql`
  fragment CedarRoleType on CedarRoleType {
    id
    name
    description
  }
`;

export const GetCedarRoleTypesQuery = gql`
  ${CedarRoleType}
  query GetCedarRoleTypes {
    roleTypes {
      ...CedarRoleType
    }
  }
`;

export const SetRolesForUserOnSystemQuery = gql`
  mutation SetRolesForUserOnSystem($input: SetRolesForUserOnSystemInput!) {
    setRolesForUserOnSystem(input: $input)
  }
`;
