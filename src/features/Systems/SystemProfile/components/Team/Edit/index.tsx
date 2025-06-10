import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  Icon
} from '@trussworks/react-uswds';
import TeamTable from 'features/Systems/SystemWorkspace/components/TeamTable';
import {
  CedarRole,
  useSetRolesForUserOnSystemMutation
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Breadcrumbs from 'components/Breadcrumbs';
import IconLink from 'components/IconLink';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import useIsWorkspaceParam from 'hooks/useIsWorkspaceParam';
import useMessage from 'hooks/useMessage';
import { TeamMemberRoleTypeName, UsernameWithRoles } from 'types/systemProfile';

import { TeamContactCard } from '..';

import TeamMemberForm from './TeamMemberForm';

export const getTeamMemberName = (user: UsernameWithRoles) => {
  return `${user.roles[0].assigneeFirstName} ${user.roles[0].assigneeLastName}`;
};

export const requisiteLevelsOfTeamRoles: TeamMemberRoleTypeName[][] = [
  ['Business Owner'],
  ['System Maintainer'],
  [
    // Treat this set as a matcher for any of these roles
    "Contracting Officer's Representative (COR)",
    'Government Task Lead (GTL)',
    'Project Lead'
  ]
];

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
 * This component has modes for:
 * - Edit and add
 * - `isWorkspace` or System Profile (original)
 */
const EditTeam = ({
  name,
  team,
  numberOfFederalFte,
  numberOfContractorFte
}: EditTeamProps) => {
  const { t } = useTranslation(['systemProfile', 'systemWorkspace']);
  const history = useHistory();
  const {
    Message,
    showMessage,
    errorMessageInModal,
    showErrorMessageInModal,
    clearMessage
  } = useMessage();

  const flags = useFlags();
  const isWorkspace = useIsWorkspaceParam();

  const [memberToDelete, setMemberToDelete] = useState<{
    euaUserId: string;
    commonName: string;
  } | null>(null);

  /**
   * Give the user some feedback on important roles when deleting.
   * Find out if the `memberToDelete` is the last of a certain role.
   */
  const deletingLastOfRole = useMemo(() => {
    if (memberToDelete) {
      const member = team.find(
        user => user.assigneeUsername === memberToDelete.euaUserId
      );
      const requisiteRoleSetFound = requisiteLevelsOfTeamRoles.find(lvl => {
        return member?.roles.some(r =>
          lvl.includes(r.roleTypeName as TeamMemberRoleTypeName)
        );
      });
      if (requisiteRoleSetFound) {
        // Check the rest of the team to see if this is the last member with the role
        const secondary = team.find(
          user =>
            user.assigneeUsername !== member?.assigneeUsername &&
            user.roles.find(r =>
              requisiteRoleSetFound.includes(
                r.roleTypeName as TeamMemberRoleTypeName
              )
            )
        );
        if (!secondary) {
          if (requisiteRoleSetFound.includes('Project Lead')) {
            // Special case to shorten the Project Lead set, which is used as a key value later on
            return 'Project Lead';
          }
          return requisiteRoleSetFound[0]; // Other sets have 1 element
        }
      }
    }
    return null;
  }, [memberToDelete, team]);

  const { pathname, state } = useLocation<{ user?: CedarRole }>();

  const { systemId: cedarSystemId, action } = useParams<{
    systemId: string;
    action?: 'team-member';
  }>();

  const actionType = state?.user ? 'edit' : 'add';

  const [updateRoles, { loading }] = useSetRolesForUserOnSystemMutation({
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
        showErrorMessageInModal(
          t('singleSystem.editTeam.form.errorRemoveContact')
        )
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

  /**
   * Make sure all these requisite levels are fulfilled.
   * Show an alert if there are any missing roles.
   */
  const showRequisiteRolesAlert = useMemo(() => {
    return !requisiteLevelsOfTeamRoles.every(lvl =>
      // At every role level
      // With each role of a level
      lvl.some(r =>
        // Find someone on the team with a matching role in the current level
        team.some(u => u.roles.some(ur => ur.roleTypeName === r))
      )
    );
  }, [team]);

  return (
    <MainContent className="grid-container margin-bottom-10">
      {flags.systemWorkspaceTeam && !isWorkspace && (
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

      {flags.systemWorkspaceTeam && isWorkspace && !action && (
        <Breadcrumbs
          items={[
            { text: t('systemWorkspace:breadcrumbs.home'), url: `/systems/` },
            {
              text: t('systemWorkspace:header'),
              url: `/systems/${cedarSystemId}/workspace`
            },
            { text: t('singleSystem.editTeam.workspace.title') }
          ]}
        />
      )}

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
            icon={<Icon.ArrowBack aria-label="back" />}
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

          {isWorkspace && showRequisiteRolesAlert && (
            // If any requirement not met
            <Alert
              headingLevel="h4"
              type="warning"
              data-testid="requisite-roles-alert"
            >
              {t('singleSystem.editTeam.workspace.teamRoleRequirementAlert')}

              {/* Causes Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.  */}
              <ul className="easi-list padding-left-3">
                <li>
                  {t(
                    'singleSystem.editTeam.workspace.teamRoleRequirementAlertList.0'
                  )}
                </li>
                <li>
                  {t(
                    'singleSystem.editTeam.workspace.teamRoleRequirementAlertList.1'
                  )}
                </li>
                <li>
                  {t(
                    'singleSystem.editTeam.workspace.teamRoleRequirementAlertList.2'
                  )}
                </li>
              </ul>
            </Alert>
          )}

          {/* Team Members section */}
          <h4 className="margin-top-5 margin-bottom-1">
            {t('singleSystem.editTeam.teamMembers')}
          </h4>

          <Button
            type="button"
            onClick={() =>
              history.push({
                pathname: `${pathname}/team-member`,
                search: isWorkspace ? 'workspace' : undefined
              })
            }
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
                icon={<Icon.ArrowBack aria-label="back" />}
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
            closeModal={() => {
              clearMessage();
              setMemberToDelete(null);
            }}
          >
            <h3 className="margin-y-0 line-height-heading-2">
              {t('singleSystem.editTeam.removeModalTitle')}
            </h3>
            {errorMessageInModal && (
              <Alert type="error" className="margin-top-2" headingLevel="h4">
                {errorMessageInModal}
              </Alert>
            )}
            <p>
              {!isWorkspace
                ? t('singleSystem.editTeam.removeModalDescription', {
                    commonName: memberToDelete?.commonName
                  })
                : t(
                    'singleSystem.editTeam.workspace.removeModalDescription.text',
                    {
                      commonName: memberToDelete?.commonName,
                      roleDetail: deletingLastOfRole
                        ? t(
                            `singleSystem.editTeam.workspace.removeModalDescription.${
                              // GTL and COR roles use the same text key as Project Lead
                              [
                                'Government Task Lead (GTL)',
                                "Contracting Officer's Representative (COR)"
                              ].includes(deletingLastOfRole)
                                ? 'Project Lead'
                                : deletingLastOfRole
                            }`,
                            {
                              commonName: memberToDelete?.commonName
                            }
                          )
                        : ''
                    }
                  )}
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
                onClick={() => {
                  clearMessage();
                  setMemberToDelete(null);
                }}
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
    </MainContent>
  );
};

export default EditTeam;
