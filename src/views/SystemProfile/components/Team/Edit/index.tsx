import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Route,
  Switch
  // useParams
} from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import HelpText from 'components/shared/HelpText';

import TeamMemberForm from './TeamMemberForm';

/**
 * Edit system profile team form
 */
const EditTeam = () => {
  const { t } = useTranslation('systemProfile');

  // const { systemId } = useParams<{
  //   systemId: string;
  //   action?: 'edit-roles' | 'add-team-member';
  // }>();

  return (
    <GridContainer className="margin-bottom-8">
      <Grid>
        <Switch>
          {/* Add/edit team member form */}
          <Route path="/systems/:systemId/team/edit/:action(edit-roles|add-team-member)">
            <TeamMemberForm />
          </Route>

          {/* Edit team page */}
          <Route path="/systems/:systemId/team/edit">
            <PageHeading className="margin-bottom-1">
              {t('singleSystem.editTeam.title')}
            </PageHeading>
            <p>{t('singleSystem.editTeam.description')}</p>
            <HelpText>{t('singleSystem.editTeam.helpText')}</HelpText>
          </Route>
        </Switch>
      </Grid>
    </GridContainer>
  );
};

export default EditTeam;
