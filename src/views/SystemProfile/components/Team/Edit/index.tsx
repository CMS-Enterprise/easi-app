import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
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
import Spinner from 'components/Spinner';
import GetSystemProfileTeamQuery from 'queries/SystemProfileTeamQueries';
import {
  GetSystemProfileTeam,
  GetSystemProfileTeamVariables
} from 'queries/types/GetSystemProfileTeam';

import TeamMemberForm from './TeamMemberForm';

type EmployeeFields = {
  federal: string;
  contractors: string;
};

/**
 * Edit system profile team form
 */
const EditTeam = () => {
  const { t } = useTranslation('systemProfile');

  const { systemId: cedarSystemId } = useParams<{
    systemId: string;
    action?: 'edit-roles' | 'add-team-member';
  }>();

  const { data, loading } = useQuery<
    GetSystemProfileTeam,
    GetSystemProfileTeamVariables
  >(GetSystemProfileTeamQuery, {
    variables: {
      cedarSystemId
    }
  });

  const { numberOfContractorFte, numberOfFederalFte } =
    data?.cedarSystemDetails?.businessOwnerInformation || {};

  const { control, reset, watch } = useForm<EmployeeFields>({
    defaultValues: {
      federal: '',
      contractors: ''
    }
  });

  const federal = watch('federal');
  const contractors = watch('contractors');

  // Set default values after query data loads
  useEffect(() => {
    if (!federal && !contractors && !loading) {
      reset({
        federal: numberOfFederalFte || '',
        contractors: numberOfContractorFte || ''
      });
    }
  }, [
    reset,
    federal,
    contractors,
    numberOfContractorFte,
    numberOfFederalFte,
    loading
  ]);

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

            {loading ? (
              <Spinner className="margin-top-3" />
            ) : (
              // Employees form
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
            )}
          </Route>
        </Switch>
      </Grid>
    </GridContainer>
  );
};

export default EditTeam;
