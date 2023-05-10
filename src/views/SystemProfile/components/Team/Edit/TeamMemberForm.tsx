import React from 'react';
import { useTranslation } from 'react-i18next';

import { CedarRole } from 'queries/types/CedarRole';

/**
 * Form to add or edit a system profile team member
 */
const TeamMemberForm = ({ user }: { user?: CedarRole }) => {
  const { t } = useTranslation('systemProfile');

  return (
    <>
      <h1 className="margin-bottom-1">
        {t('singleSystem.editTeam.form.addTeamMember')}
      </h1>
      <p>{t('singleSystem.editTeam.form.addDescription')}</p>
    </>
  );
};

export default TeamMemberForm;
