import { gql } from '@apollo/client';

const GetSystemProfileTeamQuery = gql`
  query GetSystemProfileTeam($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        numberOfFederalFte
        numberOfContractorFte
      }
      roles {
        objectID
        assigneeFirstName
        assigneeLastName
        assigneeUsername
        assigneeEmail
        roleTypeName
      }
    }
  }
`;

export default GetSystemProfileTeamQuery;
