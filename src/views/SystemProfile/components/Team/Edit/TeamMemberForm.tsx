import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';

/**
 * Form to add or edit a system profile team member
 */
const TeamMemberForm = () => {
  const { t } = useTranslation('systemProfile');

  return (
    <>
      <PageHeading className="margin-bottom-1">
        {t('singleSystem.editTeam.form.addTeamMember')}
      </PageHeading>
      <p>{t('singleSystem.editTeam.form.addDescription')}</p>
    </>
  );
};

export default TeamMemberForm;
