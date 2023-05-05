import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Route,
  Switch
  // useParams
} from 'react-router-dom';
import {
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Label,
  TextInput
} from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';

import TeamMemberForm from './TeamMemberForm';

type EmployeeFields = {
  federal: number;
  contractors: number;
};

/**
 * Edit system profile team form
 */
const EditTeam = () => {
  const { t } = useTranslation('systemProfile');

  // const { systemId } = useParams<{
  //   systemId: string;
  //   action?: 'edit-roles' | 'add-team-member';
  // }>();

  const { control } = useForm<EmployeeFields>();

  return (
    <GridContainer className="margin-bottom-8">
      <Grid className="tablet:grid-col-6">
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

            {/* Employee fields */}
            <Form className="maxw-none" onSubmit={e => e.preventDefault()}>
              {/* Federal employees input */}
              <Controller
                name="federal"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormGroup error={!!error}>
                    <Label htmlFor={field.name}>
                      {t('singleSystem.editTeam.federalEmployees')}
                    </Label>
                    {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      ref={null}
                      id={field.name}
                      type="number"
                    />
                  </FormGroup>
                )}
              />

              {/* Contractors input */}
              <Controller
                name="contractors"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormGroup error={!!error}>
                    <Label htmlFor={field.name}>
                      {t('singleSystem.editTeam.contractors')}
                    </Label>
                    {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
                    <TextInput
                      {...field}
                      ref={null}
                      id={field.name}
                      type="number"
                    />
                  </FormGroup>
                )}
              />
            </Form>
          </Route>
        </Switch>
      </Grid>
    </GridContainer>
  );
};

export default EditTeam;
