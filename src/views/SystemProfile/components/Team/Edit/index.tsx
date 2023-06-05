import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  CardGroup,
  Grid,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import { CedarRole } from 'queries/types/CedarRole';
import { UsernameWithRoles } from 'types/systemProfile';

import { TeamContactCard } from '..';

import TeamMemberForm from './TeamMemberForm';

// type EmployeeFields = {
//   numberOfFederalFte: number;
//   numberOfContractorFte: number;
// };

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

  const { pathname, state } = useLocation<{ user?: CedarRole }>();

  const { systemId: cedarSystemId, action } = useParams<{
    systemId: string;
    action?: 'team-member';
  }>();

  const actionType = state?.user ? 'edit' : 'add';

  /**
   * Employees form hidden until work to update data in CEDAR is completed
   */

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { isDirty }
  // } = useForm<EmployeeFields>({
  //   defaultValues: {
  //     numberOfFederalFte,
  //     numberOfContractorFte
  //   }
  // });

  // const returnAndSubmit = handleSubmit(
  //   async formData => {
  //     if (isDirty) {
  //       // TODO: mutation to update system
  //       // await mutate();
  //     } else {
  //       history.push(`/systems/${cedarSystemId}/team`);
  //     }
  //   },
  //   error => {
  //     // console.log(error);
  //   }
  // );

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
        {action === 'team-member' ? (
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
              {t(`singleSystem.editTeam.form.${actionType}.title`)}
            </Breadcrumb>
          </>
        ) : (
          <Breadcrumb>{t('singleSystem.editTeam.title')}</Breadcrumb>
        )}
      </BreadcrumbBar>

      <Grid className="tablet:grid-col-6">
        {action ? (
          /* Add/edit team member form */
          <TeamMemberForm cedarSystemId={cedarSystemId} />
        ) : (
          /* Edit team page */
          <>
            <h1 className="margin-bottom-1">
              {t('singleSystem.editTeam.title')}
            </h1>
            <p>{t('singleSystem.editTeam.description')}</p>
            <HelpText>{t('singleSystem.editTeam.helpText')}</HelpText>

            <IconLink
              to={`/systems/${cedarSystemId}/team`}
              icon={<IconArrowBack />}
              className="margin-top-3 margin-bottom-6"
            >
              {t('returnToSystemProfile')}
            </IconLink>

            {/* Employees fields hidden until work to update in CEDAR is completed */}
            {/* <Form className="maxw-none" onSubmit={e => e.preventDefault()}>
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
              </Form> */}

            {/* Team Members section */}
            <h2 className="margin-top-6 margin-bottom-205">
              {t('singleSystem.editTeam.teamMembers')}
            </h2>

            <Button
              type="button"
              onClick={() => history.push(`${pathname}/team-member`)}
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
                  // TODO in EASI-2447: Functionality to edit roles and remove team member
                  footerActions={{
                    editRoles: () =>
                      history.push(
                        `${pathname}/team-member`,
                        // Send user info to edit form
                        { user }
                      ),
                    removeTeamMember: () => null
                  }}
                />
              ))}
            </CardGroup>

            <IconLink
              to={`/systems/${cedarSystemId}/team`}
              icon={<IconArrowBack />}
              className="margin-top-6"
            >
              {t('returnToSystemProfile')}
            </IconLink>
          </>
        )}
      </Grid>
    </GridContainer>
  );
};

export default EditTeam;
