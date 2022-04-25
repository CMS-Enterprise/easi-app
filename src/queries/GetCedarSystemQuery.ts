import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystem($cedarSystemId: String!) {
    cedarSystem(cedarSystemId: $cedarSystemId) {
      id
      name
      description
      acronym
      status
      businessOwnerOrg
      businessOwnerOrgComp
      systemMaintainerOrg
      systemMaintainerOrgComp
      versionId
    }
  }
`;
