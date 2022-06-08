import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileTeam($systemId: String!) {
    cedarSystemDetails(cedarSystemId: $systemId) {
      businessOwnerInformation {
        numberOfContractorFte
        numberOfFederalFte
      }
      roles {
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
    }
  }
`;
