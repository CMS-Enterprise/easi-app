import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, CardGroup, IconArrowBack } from '@trussworks/react-uswds';

import IconLink from 'components/shared/IconLink';
import { UsernameWithRoles } from 'types/systemProfile';

import { TeamContactCard } from '..';

/**
 * Form to add or edit a system profile team member
 */
const TeamMemberForm = ({ cedarSystemId }: { cedarSystemId: string }) => {
  const { t } = useTranslation('systemProfile');

  const { state } = useLocation<{ user: UsernameWithRoles }>();
  const user = state?.user;

  const keyPrefix = `singleSystem.editTeam.form.${user ? 'edit' : 'add'}`;

  return (
    <>
      <h1 className="margin-bottom-1">{t(`${keyPrefix}.title`)}</h1>
      <p className="margin-bottom-6">{t(`${keyPrefix}.description`)}</p>

      {user ? (
        // If editing, show contact card without roles
        <CardGroup>
          <TeamContactCard user={user} displayRoles={false} />
        </CardGroup>
      ) : (
        // If adding new contact, show CEDAR contact select field
        <div>Contact select field</div>
      )}

      {/* Role multiselect */}

      <Button
        type="submit"
        // disabled={isSubmitting}
        className="margin-top-4"
      >
        {t(`${keyPrefix}.buttonLabel`)}
      </Button>

      <IconLink
        icon={<IconArrowBack />}
        to={`/systems/${cedarSystemId}/team/edit`}
        className="margin-top-3"
      >
        {t(`${keyPrefix}.returnButtonLabel`)}
      </IconLink>
    </>
  );
};

export default TeamMemberForm;
