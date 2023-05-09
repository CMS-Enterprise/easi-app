import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  CardGroup,
  Form,
  FormGroup,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';

import CedarContactSelect from 'components/CedarContactSelect';
// import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import MultiSelect from 'components/shared/MultiSelect';
import Spinner from 'components/Spinner';
import {
  GetCedarRoleTypesQuery,
  SetRolesForUserOnSystemQuery
} from 'queries/CedarRoleQueries';
import { GetCedarRoleTypes } from 'queries/types/GetCedarRoleTypes';
import {
  SetRolesForUserOnSystem,
  SetRolesForUserOnSystemVariables
} from 'queries/types/SetRolesForUserOnSystem';
import { UserInfo } from 'queries/types/UserInfo';
import { UsernameWithRoles } from 'types/systemProfile';

import { TeamContactCard } from '..';

type TeamMemberFields = {
  userInfo: UserInfo;
  roles: string[];
};

/**
 * Form to add or edit a system profile team member
 */
const TeamMemberForm = ({ cedarSystemId }: { cedarSystemId: string }) => {
  const { t } = useTranslation('systemProfile');

  const { state } = useLocation<{ user: UsernameWithRoles }>();
  const user = state?.user;

  const keyPrefix = `singleSystem.editTeam.form.${user ? 'edit' : 'add'}`;

  const { data, loading: roleTypesLoading } = useQuery<GetCedarRoleTypes>(
    GetCedarRoleTypesQuery
  );

  const [update] = useMutation<
    SetRolesForUserOnSystem,
    SetRolesForUserOnSystemVariables
  >(SetRolesForUserOnSystemQuery);

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<TeamMemberFields>({
    defaultValues: {
      roles: []
    }
  });

  const submitForm = handleSubmit(formData => {
    if (isDirty) {
      update({
        variables: {
          input: {
            cedarSystemID: cedarSystemId,
            euaUserId: formData.userInfo.euaUserId,
            desiredRoleTypeIDs: []
          }
        }
      });
    }
  });

  return (
    <>
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
            name="userInfo"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup error={!!error}>
                  <Label htmlFor={field.name}>
                    {t('singleSystem.editTeam.form.name')}
                  </Label>
                  <HelpText>
                    {t('singleSystem.editTeam.form.nameDescription')}
                  </HelpText>
                  {/* {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>} */}
                  <CedarContactSelect
                    {...{ ...field, ref: null }}
                    id={field.name}
                    className="maxw-none"
                    // onChange={cedarContact => console.log(cedarContact)}
                  />
                </FormGroup>
              );
            }}
          />
        )}

        {/* Role multiselect */}
        <Controller
          name="roles"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('singleSystem.editTeam.form.roles')}
              </Label>
              <HelpText>
                {t('singleSystem.editTeam.form.rolesDescription')}
              </HelpText>
              {/* {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>} */}
              {roleTypesLoading ? (
                <Spinner className="margin-top-1" />
              ) : (
                <MultiSelect
                  {...{ ...field, ref: null }}
                  className="margin-top-1 maxw-none"
                  name={field.name}
                  options={(data?.roleTypes || []).map(role => ({
                    value: role.id,
                    label: role.name
                  }))}
                />
              )}
            </FormGroup>
          )}
        />

        <Button
          type="submit"
          // disabled={isSubmitting}
          className="margin-top-4"
        >
          {t(`${keyPrefix}.buttonLabel`)}
        </Button>
      </Form>

      <IconLink
        icon={<IconArrowBack />}
        to={`/systems/${cedarSystemId}/team/edit`}
        className="margin-top-3"
      >
        {t(`${keyPrefix}.returnButtonLabel`)}
      </IconLink>
    </>
  );
};

export default TeamMemberForm;
