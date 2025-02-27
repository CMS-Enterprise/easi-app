import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  fragment CedarRoleFragment on CedarRole {
    application
    objectID
    roleTypeID
    assigneeType
    assigneeUsername
    assigneeEmail
    assigneeOrgID
    assigneeOrgName
    assigneeFirstName
    assigneeLastName
    roleTypeName
    roleID
  }
`);
