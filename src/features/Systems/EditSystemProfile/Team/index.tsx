import React, { useMemo } from 'react';
import EditTeam from 'features/Systems/SystemProfile/components/Team/Edit';
import { CedarAssigneeType, CedarRole } from 'gql/generated/graphql';

import { CedarRoleAssigneePerson } from 'types/systemProfile';
import getUsernamesWithRoles from 'utils/getUsernamesWithRoles';

type TeamProps = {
  systemName: string;
  roles: CedarRole[];
};

const Team = ({ systemName, roles }: TeamProps) => {
  const team = useMemo(
    () =>
      getUsernamesWithRoles(
        roles.filter(
          (role): role is CedarRoleAssigneePerson =>
            role.assigneeType === CedarAssigneeType.PERSON
        )
      ),
    [roles]
  );

  return (
    <EditTeam
      name={systemName}
      team={team}
      numberOfFederalFte={undefined}
      numberOfContractorFte={undefined}
    />
  );
};

export default Team;
