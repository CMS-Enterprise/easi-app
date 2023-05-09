import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams
} from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  CardGroup,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
import GetSystemProfileTeamQuery from 'queries/SystemProfileTeamQueries';
import {
  GetSystemProfileTeam,
  GetSystemProfileTeamVariables
} from 'queries/types/GetSystemProfileTeam';
import { CedarAssigneeType } from 'types/graphql-global-types';
import { UsernameWithRoles } from 'types/systemProfile';
import NotFound from 'views/NotFound';
import { getUsernamesWithRoles } from 'views/SystemProfile';

import { getTeam, TeamContactCard } from '..';

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
  const history = useHistory();

  const { pathname } = useLocation();

  const { systemId: cedarSystemId, action } = useParams<{
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

  const { roles, businessOwnerInformation, cedarSystem } =
    data?.cedarSystemDetails || {};
  const { name } = cedarSystem || {};
  const { numberOfContractorFte, numberOfFederalFte } =
    businessOwnerInformation || {};

  /** Formatted array of role objects */
  const team: UsernameWithRoles[] = useMemo(() => {
    if (!roles) return [];

    const usernamesWithRoles = getUsernamesWithRoles(
      roles.map(role => ({
        ...role,
        assigneeType: CedarAssigneeType.PERSON
      }))
    );

    const { businessOwners, projectLeads, additional } = getTeam(
      usernamesWithRoles
    );

    return [...businessOwners, ...projectLeads, ...additional];
  }, [roles]);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty }
  } = useForm<EmployeeFields>({
    defaultValues: {
      federal: '',
      contractors: ''
    }
  });

  const federal = watch('federal');
  const contractors = watch('contractors');

  const returnAndSubmit = handleSubmit(
    async formData => {
      if (isDirty) {
        // TODO: mutation to update system
        // await mutate();
      } else {
        history.push(`/systems/${cedarSystemId}/team`);
      }
    },
    error => {
      // console.log(error);
    }
  );

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

  if (loading) return <PageLoading />;

  if (!data) return <NotFound />;

  return (
    <GridContainer className="margin-bottom-10">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/systems">
            {t('singleSystem.editTeam.systems')}
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/systems/${cedarSystemId}/team`}>
            {name}
          </BreadcrumbLink>
        </Breadcrumb>
        {action ? (
          <>
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to={`/systems/${cedarSystemId}/team/edit`}
              >
                {t('singleSystem.editTeam.title')}
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb>
              {t(
                `singleSystem.editTeam.${
                  action === 'edit-roles'
                    ? 'editTeamMemberRoles'
                    : 'form.addTeamMember'
                }`
              )}
            </Breadcrumb>
          </>
        ) : (
          <Breadcrumb>{t('singleSystem.editTeam.title')}</Breadcrumb>
        )}
      </BreadcrumbBar>

      <Grid className="tablet:grid-col-6">
        <Switch>
          {/* Add/edit team member form */}
          <Route path="/systems/:systemId/team/edit/:action(edit-roles|add-team-member)">
            <TeamMemberForm />
          </Route>

          {/* Edit team page */}
          <Route path="/systems/:systemId/team/edit">
            <h1 className="margin-bottom-1">
              {t('singleSystem.editTeam.title')}
            </h1>
            <p>{t('singleSystem.editTeam.description')}</p>
            <HelpText>{t('singleSystem.editTeam.helpText')}</HelpText>

            <IconButton
              type="button"
              onClick={() => returnAndSubmit()}
              icon={<IconArrowBack />}
              className="margin-top-3 margin-bottom-6"
              unstyled
            >
              {t('returnToSystemProfile')}
            </IconButton>

            {/* Employees form */}
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
            {/* Team Members section */}
            <h2 className="margin-top-6 margin-bottom-205">
              {t('singleSystem.editTeam.teamMembers')}
            </h2>
            <Button
              type="button"
              onClick={() => history.push(`${pathname}/add-team-member`)}
            >
              {t('singleSystem.editTeam.addNewTeamMember')}
            </Button>
            <h4 className="margin-top-4">
              {t('singleSystem.editTeam.currentTeamMembers')}
            </h4>
            <CardGroup data-testid="teamCardGroup">
              {team.map(user => (
                <TeamContactCard
                  user={user}
                  key={user.assigneeUsername}
                  // TODO in EASI-2447: Edit roles and remove team member functionality
                  footerActions={{
                    editRoles: () =>
                      history.push(
                        `${pathname}/edit-roles`,
                        // Send user info to edit form
                        user
                      ),
                    removeTeamMember: () => null
                  }}
                />
              ))}
            </CardGroup>
            <IconButton
              type="button"
              onClick={() => returnAndSubmit()}
              icon={<IconArrowBack />}
              className="margin-top-6"
              unstyled
            >
              {t('returnToSystemProfile')}
            </IconButton>
          </Route>
        </Switch>
      </Grid>
    </GridContainer>
  );
};

export default EditTeam;
