import { gql } from '@apollo/client';

import { CedarRole } from './GetSystemProfileQuery';

const GetSystemProfileTeamQuery = gql`
  ${CedarRole}
  query GetSystemProfileTeam($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      businessOwnerInformation {
        numberOfFederalFte
        numberOfContractorFte
      }
      roles {
        ...CedarRole
      }
    }
  }
`;

export default GetSystemProfileTeamQuery;
