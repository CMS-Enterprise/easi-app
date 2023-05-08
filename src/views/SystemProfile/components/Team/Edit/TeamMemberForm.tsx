import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Form to add or edit a system profile team member
 */
const TeamMemberForm = () => {
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
