import { SystemIntakeCollaboratorInput } from 'gql/generated/graphql';

import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { CollaboratorFields } from 'types/systemIntake';

/** Format system intake governance team field values for gql mutation */
const formatGovernanceTeamsInput = (
  teams: CollaboratorFields
): SystemIntakeCollaboratorInput[] => {
  return Object.entries(teams)
    .filter(([key, team]) => team.isPresent)
    .map(([key, team]) => {
      const govTeamObject = cmsGovernanceTeams.find(
        govTeam => govTeam.key === key
      )!;

      return {
        key,
        collaborator: team.collaborator,
        name: govTeamObject?.name
      };
    });
};

export default formatGovernanceTeamsInput;
