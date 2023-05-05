import { gql } from '@apollo/client';

const GetSystemProfileTeamQuery = gql`
  query GetSystemProfileTeam($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        numberOfFederalFte
        numberOfContractorFte
      }
    }
  }
`;

export default GetSystemProfileTeamQuery;
