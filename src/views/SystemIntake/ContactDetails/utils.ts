import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { GetSystemIntake_systemIntake_governanceTeams_teams as SystemIntakeCollaborator } from 'queries/types/GetSystemIntake';
import { SystemIntakeCollaboratorInput } from 'types/graphql-global-types';
import {
  CollaboratorFields,
  ContactFields,
  SystemIntakeContactProps
} from 'types/systemIntake';

/** Removes `role` and `systemIntakeId` fields from `SystemIntakeContactProps` type */
export const formatContactFields = ({
  role,
  systemIntakeId,
  ...contact
}: SystemIntakeContactProps): ContactFields => contact;

/** Format system intake governance team field values for gql mutation */
export const formatGovernanceTeamsInput = (
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

/** Format system intake governance team data for Contact Details fields */
export const formatGovTeamsField = (
  /** System intake `governanceTeams.teams` value */
  teams: SystemIntakeCollaborator[] | null
): CollaboratorFields => {
  return cmsGovernanceTeams.reduce((acc, { key }) => {
    /** Value from system intake */
    const teamValue = (teams || []).find(value => value.key === key);

    return {
      ...acc,
      [key]: {
        isPresent: !!teamValue,
        collaborator: teamValue?.collaborator || ''
      }
    };
  }, {} as CollaboratorFields);
};
