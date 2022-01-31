import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystem($id: String!) {
    cedarSystem(id: $id) {
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
