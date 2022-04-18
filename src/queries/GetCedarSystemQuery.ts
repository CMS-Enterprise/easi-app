import { gql } from '@apollo/client';

export default gql`
  query GetCedarSystem($versionId: String!) {
    cedarSystem(versionId: $versionId) {
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
