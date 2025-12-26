import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCedarSystem($id: UUID!) {
    cedarSystem(cedarSystemId: $id) {
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
    }
  }
`);
