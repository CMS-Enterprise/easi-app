import React, { useState } from 'react';
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
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import * as yup from 'yup';

import CedarContactSelect from 'components/CedarContactSelect';
import PageLoading from 'components/PageLoading';
import CollapsableLink from 'components/shared/CollapsableLink';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import MultiSelect from 'components/shared/MultiSelect';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import { GetCedarRoleTypesQuery } from 'queries/CedarRoleQueries';
import { GetCedarRoleTypes } from 'queries/types/GetCedarRoleTypes';
import {
  SetRolesForUserOnSystem,
  SetRolesForUserOnSystemVariables
} from 'queries/types/SetRolesForUserOnSystem';
import { UsernameWithRoles } from 'types/systemProfile';

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
  loading
}: TeamMemberFormProps) => {
  const { t } = useTranslation('systemProfile');

  // const tmpflag = false;

  const { showMessageOnNextPage, showMessage } = useMessage();
  const history = useHistory();
  const { state } = useLocation<{ user?: UsernameWithRoles }>();
  const user = state?.user;

  /* User commonName prop used for setting success/error messages */
  const [commonName, setCommonName] = useState<string>(
    user ? getTeamMemberName(user) : ''
  );

  const keyPrefix = `singleSystem.editTeam.form.${user ? 'edit' : 'add'}`;

  const { data, loading: roleTypesLoading } = useQuery<GetCedarRoleTypes>(
    GetCedarRoleTypesQuery
  );

  const availableRolesText = t<Record<string, string[]>>(
    'singleSystem.editTeam.form.availableRoles',
    {
      returnObjects: true
    }
  );

  // console.log(data?.roleTypes);

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
                user ? 'successUpdateRoles' : 'successAddContact'
              }`,
              {
                commonName
              }
            ),
            {
              type: 'success'
            }
          );
          history.push(`/systems/${cedarSystemId}/team/edit`);
        })
        .catch(() => {
          showMessage(
            t(
              `singleSystem.editTeam.form.${
                user ? 'errorUpdateRoles' : 'errorAddContact'
              }`
            ),
            {
              type: 'error'
            }
          );
        });
    }
  });

  if (roleTypesLoading) {
    return <PageLoading />;
  }

  return (
    <Grid className="tablet:grid-col-6">
      <h1 className="margin-bottom-1">{t(`${keyPrefix}.title`)}</h1>
      <p className="margin-bottom-6">{t(`${keyPrefix}.description`)}</p>

      <Form onSubmit={submitForm} className="maxw-none">
        {user ? (
          // If editing, show contact card without roles
          <CardGroup>
            <TeamContactCard user={user} displayRoles={false} />
          </CardGroup>
        ) : (
          // If adding new contact, show CEDAR contact select field
          <Controller
            name="euaUserId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label htmlFor={field.name} className="margin-bottom-05">
                  {t('singleSystem.editTeam.form.name')}
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
                  value={user}
                  onChange={contact => {
                    if (contact) {
                      setValue('euaUserId', contact?.euaUserId);
                      setCommonName(contact.commonName);
                    }
                  }}
                  className="maxw-none"
                  // onChange={cedarContact => console.log(cedarContact)}
                />
              </FormGroup>
            )}
          />
        )}

        {/* Role multiselect */}
        <Controller
          name="desiredRoleTypeIDs"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup
              error={!!error}
              className={classNames({ 'margin-top-1': !!user })}
            >
              <Label htmlFor={field.name} className="margin-bottom-05">
                {t('singleSystem.editTeam.form.roles')}
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
                name={field.name}
                options={(data?.roleTypes || []).map(role => ({
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
          <p>
            <strong>
              {t('singleSystem.editTeam.form.availableRoles.primaryLabel')}
            </strong>
          </p>
          <ul>
            {availableRolesText.primaryList.map(li => (
              <li key={li}>
                <Trans>{li}</Trans>
              </li>
            ))}
          </ul>
          <p>
            <strong>
              {t('singleSystem.editTeam.form.availableRoles.pocLabel')}
            </strong>
            <br />
            <span className="text-base-dark">
              {t('singleSystem.editTeam.form.availableRoles.pocText')}
            </span>
          </p>
          <ul>
            {availableRolesText.pocList.map(li => (
              <li key={li}>
                <Trans>{li}</Trans>
              </li>
            ))}
          </ul>
        </CollapsableLink>

        <Alert slim type="info">
          {t('singleSystem.editTeam.form.add.alertInfo')}
        </Alert>

        <div className="display-flex flex-align-center margin-top-6">
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              loading ||
              !isDirty ||
              watch('desiredRoleTypeIDs').length === 0 ||
              !watch('euaUserId')
            }
            className="margin-0"
          >
            {t(`${keyPrefix}.buttonLabel`)}
          </Button>
          {loading && <Spinner className="margin-left-1" />}
        </div>
      </Form>

      <IconLink
        icon={<IconArrowBack />}
        to={`/systems/${cedarSystemId}/team/edit`}
        className="margin-top-3"
      >
        {t(`${keyPrefix}.returnButtonLabel`)}
      </IconLink>
    </Grid>
  );
};

export default TeamMemberForm;
