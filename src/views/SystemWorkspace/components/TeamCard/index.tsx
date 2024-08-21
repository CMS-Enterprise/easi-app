import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { GetSystemWorkspace_cedarSystemDetails_roles as CedarRoles } from 'queries/types/GetSystemWorkspace';

type Props = {
  roles: CedarRoles[];
};

function TeamCard({ roles }: Props) {
  const { t } = useTranslation('systemWorkspace');

  const teamCountCap = 8;

  return (
    <div>
      <h3>{t('spaces.team.header')}</h3>
      <div>{t('spaces.team.description')}</div>
      <div>
        {roles.slice(0, teamCountCap).map(role => {
          return (
            <div key={role.roleID}>
              <div>{role.assigneeFirstName}</div>
              <div>{role.roleTypeName}</div>
            </div>
          );
        })}
      </div>
      <UswdsReactLink
        variant="unstyled"
        className="usa-button usa-button--disabled"
        to="#"
      >
        {t('spaces.team.add')}
      </UswdsReactLink>
      <UswdsReactLink
        variant="unstyled"
        className="usa-button usa-button--outline usa-button--disabled"
        to="#"
      >
        {t('spaces.team.manage')}
      </UswdsReactLink>
    </div>
  );
}

export default TeamCard;
