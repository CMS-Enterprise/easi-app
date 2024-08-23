import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';
import { teamRolesIndex } from 'constants/sortIndexes';
import { UsernameWithRoles } from 'types/systemProfile';

import SpacesCard from '../SpacesCard';

type Props = {
  roles: UsernameWithRoles[];
};

function TeamCard({ roles }: Props) {
  const { t } = useTranslation('systemWorkspace');

  const teamCountCap = 8;

  const rolesSorted = useMemo(() => {
    const roleEndIdx = Object.keys(teamRolesIndex()).length;
    return roles.sort((a: UsernameWithRoles, b: UsernameWithRoles) => {
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

  return (
    <SpacesCard
      fullWidth
      header={t('spaces.team.header')}
      description={t('spaces.team.description')}
      body={
        <div className="grid-row flex-wrap margin-bottom-neg-1">
          {rolesSorted.slice(0, teamCountCap).map((role, idx) => {
            const p = role.roles[0];
            const moreRolesCount = role.roles.length - 1;

            return (
              <div
                key={p.roleID}
                className="grid-col-3 margin-bottom-1 display-flex"
              >
                <AvatarCircle
                  user={`${p.assigneeFirstName || ''} ${
                    p.assigneeLastName || ''
                  }`}
                />
                <div className="margin-x-05">
                  <div className="margin-y-05 line-height-body-5">
                    {p.assigneeFirstName} {p.assigneeLastName}
                  </div>
                  <div className="font-body-2xs">
                    <div className="line-height-body-2">
                      {/* {role.roles.map(r => {
                      return <div key={r.roleTypeID}>{r.roleTypeName}</div>;
                    })} */}
                      <div>{p.roleTypeName}</div>
                      {moreRolesCount > 0 && (
                        <div>
                          {t('spaces.team.moreRolesCount', {
                            count: moreRolesCount
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
