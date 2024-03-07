import { gql } from '@apollo/client';

export default gql`
  query GetMyCedarSystems {
    myCedarSystems {
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
