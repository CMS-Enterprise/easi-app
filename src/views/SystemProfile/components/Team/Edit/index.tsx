import React from 'react';
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

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
import { UsernameWithRoles } from 'types/systemProfile';

import { TeamContactCard } from '..';

import TeamMemberForm from './TeamMemberForm';

type EmployeeFields = {
  numberOfFederalFte: number;
  numberOfContractorFte: number;
};

type EditTeamProps = {
  name: string;
  team: UsernameWithRoles[];
  numberOfFederalFte: number | undefined;
  numberOfContractorFte: number | undefined;
};

/**
 * Edit system profile team form
 */
const EditTeam = ({
  name,
  team,
  numberOfFederalFte,
  numberOfContractorFte
}: EditTeamProps) => {
  const { t } = useTranslation('systemProfile');
  const history = useHistory();

  const { pathname } = useLocation();

  const { systemId: cedarSystemId, action } = useParams<{
    systemId: string;
    action?: 'edit-roles' | 'add-team-member';
  }>();

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<EmployeeFields>({
    defaultValues: {
      numberOfFederalFte,
      numberOfContractorFte
    }
  });

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
                name="numberOfFederalFte"
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
                name="numberOfContractorFte"
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
