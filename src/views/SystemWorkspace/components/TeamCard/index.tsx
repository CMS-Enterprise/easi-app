import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconExpandMore } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';
import teamRolesIndex from 'constants/teamRolesIndex';
import { CedarRole } from 'queries/types/CedarRole';
import { CedarAssigneeType } from 'types/graphql-global-types';
import {
  CedarRoleAssigneePerson,
  UsernameWithRoles
} from 'types/systemProfile';
import getUsernamesWithRoles from 'utils/getUsernamesWithRoles';

import SpacesCard from '../SpacesCard';

function MemberRole({ person }: { person: UsernameWithRoles }) {
  const { t } = useTranslation('systemWorkspace');
  const p = person.roles[0];
  const moreRolesCount = person.roles.length - 1;

  return (
    <div className="grid-col-6 desktop:grid-col-3 margin-bottom-1 display-flex">
      <AvatarCircle
        user={`${p.assigneeFirstName || ''} ${p.assigneeLastName || ''}`}
      />
      <div className="margin-left-1 margin-right-05">
        <p className="margin-y-05 line-height-body-5">
          {p.assigneeFirstName} {p.assigneeLastName}
        </p>
        <p className="font-body-2xs line-height-body-2 margin-y-0">
          {p.roleTypeName}
          {moreRolesCount > 0 && (
            <>
              <br />
              {t('spaces.team.moreRolesCount', {
                count: moreRolesCount
              })}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function TeamCard({ roles }: { roles: CedarRole[] }) {
  const { t } = useTranslation('systemWorkspace');

  const teamCountCap = 8;
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const teamSorted: UsernameWithRoles[] = useMemo(() => {
    const team: UsernameWithRoles[] = getUsernamesWithRoles(
      roles.filter(
        (role): role is CedarRoleAssigneePerson =>
          role.assigneeType === CedarAssigneeType.PERSON
      )
    );

    // Sort by roles with any unlisted moved to the end
    const roleEndIdx = Object.keys(teamRolesIndex()).length;
    return team.sort((a, b) => {
      const ar = a.roles[0];
      const br = b.roles[0];
      const ari = teamRolesIndex()[ar.roleTypeName || ''] ?? roleEndIdx;
      const bri = teamRolesIndex()[br.roleTypeName || ''] ?? roleEndIdx;
      if (ari !== bri) {
        return ari - bri;
      }
      // If roles are the same then check last names
      const alast = (ar.assigneeLastName || '').toLowerCase();
      const blast = (br.assigneeLastName || '').toLowerCase();
      if (alast < blast) return -1;
      if (alast > blast) return 1;
      // Then first names
      const afirst = (ar.assigneeFirstName || '').toLowerCase();
      const bfirst = (br.assigneeFirstName || '').toLowerCase();
      if (afirst < bfirst) return -1;
      if (afirst > bfirst) return 1;
      return 0;
    });
  }, [roles]);

  const moreCount = teamSorted.length - teamCountCap;

  return (
    <SpacesCard
      fullWidth
      header={t('spaces.team.header')}
      description={t('spaces.team.description')}
      body={
        <div className="grid-row flex-wrap margin-bottom-neg-1">
          {teamSorted
            .slice(0, isExpanded ? undefined : teamCountCap)
            .map(role => (
              <MemberRole key={role.assigneeUsername} person={role} />
            ))}
          {moreCount > 0 && (
            <div className="margin-top-1 width-full">
              <Button
                unstyled
                type="button"
                className="line-height-body-5"
                onClick={() => {
                  setExpanded(!isExpanded);
                }}
              >
                <IconExpandMore
                  className="margin-right-05 margin-bottom-2px text-tbottom"
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : ''
                  }}
                />
                {t(`spaces.team.view.${isExpanded ? 'less' : 'more'}`, {
                  count: moreCount
                })}
              </Button>
            </div>
          )}
        </div>
      }
      footer={
        <>
          <UswdsReactLink variant="unstyled" className="usa-button" to="#">
            {t('spaces.team.add')}
          </UswdsReactLink>
          <UswdsReactLink
            variant="unstyled"
            className="usa-button usa-button--outline"
            to="#"
          >
            {t('spaces.team.manage')}
          </UswdsReactLink>
        </>
      }
    />
  );
}

export default TeamCard;
