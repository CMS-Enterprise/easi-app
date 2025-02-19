import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { FetchResult, MutationFunctionOptions, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  CardGroup,
  Form,
  FormGroup,
  Grid,
  Icon,
  Label
} from '@trussworks/react-uswds';
import { GetCedarRoleTypesQuery } from 'gql/legacyGQL/CedarRoleQueries';
import {
  GetCedarRoleTypes,
  GetCedarRoleTypes_roleTypes as CedarRoleTypes
} from 'gql/legacyGQL/types/GetCedarRoleTypes';
import {
  SetRolesForUserOnSystem,
  SetRolesForUserOnSystemVariables
} from 'gql/legacyGQL/types/SetRolesForUserOnSystem';
import { useFlags } from 'launchdarkly-react-client-sdk';
import * as yup from 'yup';

import CedarContactSelect from 'components/CedarContactSelect';
import CollapsableLink from 'components/CollapsableLink';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import IconLink from 'components/IconLink';
import MultiSelect from 'components/MultiSelect';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import Spinner from 'components/Spinner';
import teamRolesIndex from 'constants/teamRolesIndex';
import useIsWorkspaceParam from 'hooks/useIsWorkspaceParam';
import useMessage from 'hooks/useMessage';
import { TeamMemberRoleTypeName, UsernameWithRoles } from 'types/systemProfile';

import { TeamContactCard } from '..';

import { getTeamMemberName } from '.';

export type TeamMemberFields = {
  euaUserId: string | null;
  desiredRoleTypeIDs: string[];
};

type TeamMemberFormProps = {
  cedarSystemId: string;
  updateRoles: (
    options?: MutationFunctionOptions<
      SetRolesForUserOnSystem,
      SetRolesForUserOnSystemVariables
    >
  ) => Promise<FetchResult<SetRolesForUserOnSystem>>;
  loading: boolean;
  team: UsernameWithRoles[];
};

const teamMemberSchema: yup.SchemaOf<TeamMemberFields> = yup.object({
  euaUserId: yup.string().required(),
  desiredRoleTypeIDs: yup.array(yup.string().required()).min(1)
});

/**
 * Form to add or edit a system profile team member
 */
const TeamMemberForm = ({
  cedarSystemId,
  updateRoles,
  loading,
  team
}: TeamMemberFormProps) => {
  const { t } = useTranslation('systemProfile');

  const flags = useFlags();
  const isWorkspace = useIsWorkspaceParam();

  const { showMessageOnNextPage, showMessage } = useMessage();
  const history = useHistory();
  const { state } = useLocation<{ user?: UsernameWithRoles }>();
  const user = state?.user;
  const isEdit = !!user;

  /* User commonName prop used for setting success/error messages */
  const [commonName, setCommonName] = useState<string>(
    user ? getTeamMemberName(user) : ''
  );

  const keyPrefix = `singleSystem.editTeam.form.${isEdit ? 'edit' : 'add'}`;

  const { data, loading: roleTypesLoading } = useQuery<GetCedarRoleTypes>(
    GetCedarRoleTypesQuery
  );

  const availableRolesText = t<Record<string, string[]>>(
    'singleSystem.editTeam.form.availableRoles',
    {
      returnObjects: true
    }
  );

  const rolesOrdered: CedarRoleTypes[] = useMemo(() => {
    const roles = data?.roleTypes;

    if (roles === undefined) return [];

    /** Hide any undefined roles. */
    const knownRoles = Object.keys(teamRolesIndex);

    return roles
      .concat()
      .filter(r => knownRoles.includes(r.name))
      .sort(
        (a, b) =>
          teamRolesIndex[a.name as TeamMemberRoleTypeName] -
          teamRolesIndex[b.name as TeamMemberRoleTypeName]
      )
      .map(r => {
        // Adjust the ISSO display name from the backend
        if (r.name === 'ISSO') {
          return { ...r, name: 'Information System Security Officer (ISSO)' };
        }
        return r;
      });
  }, [data?.roleTypes]);

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting }
  } = useForm<TeamMemberFields>({
    resolver: yupResolver(teamMemberSchema),
    defaultValues: {
      euaUserId: user?.assigneeUsername,
      desiredRoleTypeIDs: user?.roles.map(({ roleTypeID }) => roleTypeID) || []
    }
  });

  const submitForm = handleSubmit(({ euaUserId, desiredRoleTypeIDs }) => {
    if (isDirty) {
      updateRoles({
        variables: {
          input: {
            cedarSystemID: cedarSystemId,
            euaUserId: euaUserId || '',
            desiredRoleTypeIDs
          }
        }
      })
        .then(() => {
          showMessageOnNextPage(
            t(
              `singleSystem.editTeam.form.${
                isEdit ? 'successUpdateRoles' : 'successAddContact'
              }`,
              {
                commonName
              }
            ),
            {
              type: 'success'
            }
          );
          history.push({
            pathname: `/systems/${cedarSystemId}/team/edit`,
            search: isWorkspace ? 'workspace' : undefined
          });
        })
        .catch(() => {
          showMessage(
            t(
              `singleSystem.editTeam.form.${
                isEdit ? 'errorUpdateRoles' : 'errorAddContact'
              }`
            ),
            {
              type: 'error'
            }
          );
        });
    }
  });

  const euaUserId = watch('euaUserId');

  const memberAlreadySelected =
    euaUserId !== undefined && team.find(u => u.assigneeUsername === euaUserId);

  useEffect(() => {
    setValue(
      'desiredRoleTypeIDs',
      memberAlreadySelected
        ? memberAlreadySelected.roles.map(r => r.roleTypeID)
        : []
    );
  }, [setValue, memberAlreadySelected]);

  if (roleTypesLoading) {
    return <PageLoading />;
  }

  return (
    <Grid className="tablet:grid-col-6">
      <h1 className="margin-top-6 margin-bottom-1">
        {t(`${keyPrefix}.title`)}
      </h1>
      <p className="margin-bottom-0 font-body-md text-light line-height-body-4">
        {t(`${keyPrefix}.description`)}
      </p>
      <p className="margin-top-1 margin-bottom-4 text-base">
        <Trans
          i18nKey="action:fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>

      <Form onSubmit={submitForm} className="maxw-none">
        {isEdit && flags.systemWorkspaceTeam && !isWorkspace ? (
          // If editing, show contact card without roles
          // when in the original system profile context (not workspace)
          // Rendered in non-workspace edit only
          <CardGroup>
            <TeamContactCard user={user} displayRoles={false} />
          </CardGroup>
        ) : (
          // If adding new contact, show CEDAR contact select field
          // Or if in workspace context show user info in disabled dropdown
          // Rendered in workspace context for both edit + add modes
          <Controller
            name="euaUserId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label htmlFor={field.name} className="margin-bottom-05">
                  {t('singleSystem.editTeam.form.name')}
                  <RequiredAsterisk />
                </Label>
                <HelpText>
                  {t('singleSystem.editTeam.form.nameDescription')}
                </HelpText>
                {!!error && (
                  <FieldErrorMsg>
                    {t('singleSystem.editTeam.form.nameError')}
                  </FieldErrorMsg>
                )}
                <CedarContactSelect
                  {...{ ...field, ref: null }}
                  id={field.name}
                  // Edit mode will display the user in a disabled dropdown
                  value={
                    isEdit
                      ? {
                          euaUserId: user.assigneeUsername,
                          commonName,
                          email: user.roles[0].assigneeEmail || undefined
                        }
                      : undefined
                  }
                  disabled={isEdit}
                  onChange={contact => {
                    if (contact) {
                      setValue('euaUserId', contact?.euaUserId);
                      setCommonName(contact.commonName);
                    }
                  }}
                  className="maxw-none"
                  // onChange={cedarContact => console.log(cedarContact)}
                />
                {!isEdit && memberAlreadySelected && (
                  <Alert slim type="info" headingLevel="h4">
                    {t(
                      'singleSystem.editTeam.form.add.memberAlreadySelectedInfo'
                    )}
                  </Alert>
                )}
              </FormGroup>
            )}
          />
        )}
        {/* Role multiselect */}
        <Controller
          name="desiredRoleTypeIDs"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="margin-bottom-05">
                {t('singleSystem.editTeam.form.roles')}
                <RequiredAsterisk />
              </Label>
              <HelpText>
                {t('singleSystem.editTeam.form.rolesDescription')}
              </HelpText>
              {!!error && (
                <FieldErrorMsg>
                  {t('singleSystem.editTeam.form.rolesError')}
                </FieldErrorMsg>
              )}
              <MultiSelect
                {...{ ...field, ref: null }}
                key={field.value.join()} // Doing this to rerender on value change
                name={field.name}
                selectedLabel={t('singleSystem.editTeam.form.selectedRoles')}
                options={rolesOrdered.map(role => ({
                  value: role.id,
                  label: role.name
                }))}
                initialValues={field.value}
              />
            </FormGroup>
          )}
        />
        <CollapsableLink
          id="availableRoles"
          label={t('singleSystem.editTeam.form.availableRoles.link')}
        >
          <p className="margin-y-0 line-heigt-body-5">
            <strong>
              {t('singleSystem.editTeam.form.availableRoles.primaryLabel')}
            </strong>
          </p>
          <ul className="easi-list padding-left-2">
            {availableRolesText.primaryList.map(li => (
              <li key={li} className="margin-top-1">
                <Trans>{li}</Trans>
              </li>
            ))}
          </ul>
          <p className="margin-bottom-0 line-height-body-5">
            <strong>
              {t('singleSystem.editTeam.form.availableRoles.pocLabel')}
            </strong>
            <br />
            <span className="text-base-dark">
              {t('singleSystem.editTeam.form.availableRoles.pocText')}
            </span>
          </p>
          <ul className="easi-list padding-left-2">
            {availableRolesText.pocList.map(li => (
              <li key={li} className="margin-top-1">
                <Trans>{li}</Trans>
              </li>
            ))}
          </ul>
        </CollapsableLink>

        <div className="margin-top-6">
          {!isEdit && (
            <Alert headingLevel="h4" slim type="info">
              {t('singleSystem.editTeam.form.add.alertInfo')}
            </Alert>
          )}

          <div className="display-flex flex-align-center margin-top-3">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !isDirty ||
                watch('desiredRoleTypeIDs').length === 0 ||
                !euaUserId
              }
              className="margin-0"
            >
              {t(
                memberAlreadySelected
                  ? 'singleSystem.editTeam.form.edit.buttonLabel'
                  : `${keyPrefix}.buttonLabel`
              )}
            </Button>
            {loading && <Spinner className="margin-left-1" />}
          </div>
        </div>
      </Form>

      <IconLink
        icon={<Icon.ArrowBack />}
        to={
          isWorkspace
            ? `/systems/${cedarSystemId}/workspace`
            : `/systems/${cedarSystemId}/team/edit`
        }
        className="margin-top-3"
      >
        {t(`${keyPrefix}.returnButtonLabel`)}
      </IconLink>
    </Grid>
  );
};

export default TeamMemberForm;
