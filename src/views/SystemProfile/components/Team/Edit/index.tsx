import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Modal from 'components/Modal';
import IconLink from 'components/shared/IconLink';
import Spinner from 'components/Spinner';
import useIsWorkspaceParam from 'hooks/useIsWorkspaceParam';
import useMessage from 'hooks/useMessage';
import { SetRolesForUserOnSystemQuery } from 'queries/CedarRoleQueries';
import { CedarRole } from 'queries/types/CedarRole';
import {
  SetRolesForUserOnSystem,
  SetRolesForUserOnSystemVariables
} from 'queries/types/SetRolesForUserOnSystem';
import { UsernameWithRoles } from 'types/systemProfile';
import TeamTable from 'views/SystemWorkspace/TeamTable';

import { TeamContactCard } from '..';

import TeamMemberForm from './TeamMemberForm';

export const getTeamMemberName = (user: UsernameWithRoles) => {
  return `${user.roles[0].assigneeFirstName} ${user.roles[0].assigneeLastName}`;
};

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
  const { Message, showMessage } = useMessage();

  const flags = useFlags();
  const isWorkspace = useIsWorkspaceParam();

  const [memberToDelete, setMemberToDelete] = useState<{
    euaUserId: string;
    commonName: string;
  } | null>(null);

  const { pathname, state } = useLocation<{ user?: CedarRole }>();

  const { systemId: cedarSystemId, action } = useParams<{
    systemId: string;
    action?: 'team-member';
  }>();

  const actionType = state?.user ? 'edit' : 'add';

  const [updateRoles, { loading }] = useMutation<
    SetRolesForUserOnSystem,
    SetRolesForUserOnSystemVariables
  >(SetRolesForUserOnSystemQuery, {
    refetchQueries: ['GetSystemProfile']
  });

  /**
   * Remove team member and close modal
   */
  const removeUser = (user: { euaUserId: string; commonName: string }) => {
    // Set roles to empty string to remove user
    updateRoles({
      variables: {
        input: {
          cedarSystemID: cedarSystemId,
          euaUserId: user.euaUserId,
          desiredRoleTypeIDs: []
        }
      }
    })
      .then(() => {
        setMemberToDelete(null);
        showMessage(
          t('singleSystem.editTeam.form.successRemoveContact', {
            commonName: user.commonName
          }),
          {
            type: 'success'
          }
        );
      })
      .catch(() =>
        showMessage(t('singleSystem.editTeam.form.errorRemoveContact'), {
          type: 'error'
        })
      );
  };

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
      {flags.systemWorkspaceTeam && !isWorkspace && (
        // Don't show crumbs in the workspace context
        <BreadcrumbBar variant="wrap" className="padding-y-0 margin-y-2">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/systems">
              {t('singleSystem.editTeam.systems')}
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={Link}
              to={`/systems/${cedarSystemId}/team`}
            >
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
      )}

      <Message className="margin-top-2" />

      {action ? (
        /* Add/edit team member form */
        <TeamMemberForm
          cedarSystemId={cedarSystemId}
          updateRoles={updateRoles}
          loading={loading}
          team={team}
        />
      ) : (
        /* Edit team page */
        <>
          <h1 className="margin-bottom-05">
            {t(
              isWorkspace
                ? 'singleSystem.editTeam.workspace.title'
                : 'singleSystem.editTeam.title'
            )}
          </h1>
          <p className="margin-top-0 margin-bottom-1 text-darkest font-body-lg line-height-body-5 text-light">
            {t(
              isWorkspace
                ? 'systemWorkspace:requests.subhead'
                : 'singleSystem.editTeam.description'
            )}
          </p>
          <p className="margin-y-1 font-body-md line-height-body-4 text-light">
            {t(
              isWorkspace
                ? 'singleSystem.editTeam.workspace.helpText'
                : 'singleSystem.editTeam.helpText'
            )}
          </p>

          <IconLink
            to={
              isWorkspace
                ? `/systems/${cedarSystemId}/workspace`
                : `/systems/${cedarSystemId}/team`
            }
            icon={<IconArrowBack />}
            className="margin-top-2 margin-bottom-6 line-height-body-4 text-primary"
          >
            {t(
              isWorkspace
                ? 'singleSystem.editTeam.workspace.backLink'
                : 'returnToSystemProfile'
            )}
          </IconLink>

          {/* Employees fields hidden until work to update in CEDAR is completed */}
          {/*
          <Form className="maxw-none" onSubmit={e => e.preventDefault()}>
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
          </Form>
          */}

          {/* Team Members section */}
          <h4 className="margin-top-5 margin-bottom-1">
            {t('singleSystem.editTeam.teamMembers')}
          </h4>

          <Button
            type="button"
            onClick={() => history.push(`${pathname}/team-member`)}
            className="margin-bottom-05"
          >
            {t('singleSystem.editTeam.addTeamMember')}
          </Button>

          {/* Team member list */}
          {!isWorkspace ? (
            <Grid className="tablet:grid-col-6">
              <CardGroup className="margin-top-3" data-testid="teamCardGroup">
                {team.map(user => (
                  <TeamContactCard
                    user={user}
                    key={user.assigneeUsername}
                    footerActions={{
                      editRoles: () =>
                        history.push(
                          `${pathname}/team-member`,
                          // Send user info to edit form
                          { user }
                        ),
                      removeTeamMember: () =>
                        setMemberToDelete({
                          euaUserId: user.assigneeUsername,
                          commonName: getTeamMemberName(user)
                        })
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
            </Grid>
          ) : (
            <TeamTable
              cedarSystemId={cedarSystemId}
              team={team}
              setMemberToDelete={setMemberToDelete}
            />
          )}

          {/* Remove user modal */}
          <Modal
            isOpen={!!memberToDelete}
            closeModal={() => setMemberToDelete(null)}
          >
            <h3 className="margin-y-0 line-height-heading-2">
              {t('singleSystem.editTeam.removeModalTitle')}
            </h3>
            <p>
              {t('singleSystem.editTeam.removeModalDescription', {
                commonName: memberToDelete?.commonName
              })}
            </p>
            <ButtonGroup>
              {/* Confirm remove user */}
              <Button
                type="button"
                secondary
                onClick={() => {
                  if (memberToDelete) removeUser(memberToDelete);
                }}
              >
                {t('singleSystem.editTeam.removeTeamMember')}
              </Button>
              {/* Keep user / close modal */}
              <Button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="margin-left-1"
                unstyled
              >
                {t('singleSystem.editTeam.cancel')}
              </Button>

              {loading && <Spinner className="margin-top-05" />}
            </ButtonGroup>
          </Modal>
        </>
      )}
    </GridContainer>
  );
};

export default EditTeam;
