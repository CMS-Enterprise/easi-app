import React, { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  Dropdown,
  ErrorMessage,
  Fieldset,
  FormGroup
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import CheckboxField from 'components/shared/CheckboxField';
import Label from 'components/shared/Label';
import TruncatedContent from 'components/shared/TruncatedContent';
import Spinner from 'components/Spinner';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { TRBAttendee_userInfo as UserInfo } from 'queries/types/TRBAttendee';
import { PersonRole } from 'types/graphql-global-types';
import toggleArrayValue from 'utils/toggleArrayValue';

type RecipientsProps = {
  trbRequestId: string;
};

type TrbRecipient = {
  id?: string;
  userInfo: UserInfo | null;
  component: string | null;
  role: PersonRole | null;
};

type RecipientFields = {
  copyTrbMailbox: boolean;
  notifyEuaIds: string[];
  recipients: TrbRecipient[];
};

const initialRecipient: TrbRecipient = {
  userInfo: {
    __typename: 'UserInfo',
    euaUserId: '',
    commonName: '',
    email: ''
  },
  component: null,
  role: null
};

/**
 * TRB email recipients field
 */
const Recipients = ({ trbRequestId }: RecipientsProps) => {
  const { t } = useTranslation('technicalAssistance');

  const {
    data: { requester, attendees, loading }
  } = useTRBAttendees(trbRequestId);

  const {
    control,
    setValue,
    watch,
    reset,
    formState: { isDirty }
  } = useForm<RecipientFields>();

  // Recipients field
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recipients'
  });

  const notifyEuaIds = watch('notifyEuaIds');

  // Reset default values from requester and attendees
  useEffect(() => {
    if (!isDirty && !notifyEuaIds && requester?.userInfo?.euaUserId) {
      reset({
        copyTrbMailbox: true,
        notifyEuaIds: [requester.userInfo.euaUserId],
        recipients: attendees
      });
    }
  }, [isDirty, requester, attendees, reset, notifyEuaIds]);

  // If values have not been loaded yet, return loading spinner
  if (loading || !watch('notifyEuaIds')) return <Spinner />;

  const recipientsCount = watch('recipients').filter(({ id }) => id).length;

  const selectedCount = watch(['notifyEuaIds', 'copyTrbMailbox'])
    .flat()
    .filter(item => item).length;

  return (
    <Fieldset
      legend={
        <span className="text-bold">
          <Trans
            i18nKey="technicalAssistance:emailRecipientFields.label"
            components={{ red: <span className="text-error" /> }}
          />
        </span>
      }
      className="grid-col-6"
    >
      <p className="margin-bottom-0 margin-top-05">
        <Trans
          i18nKey="technicalAssistance:emailRecipientFields.selectedCount"
          components={{ bold: <span className="text-bold" /> }}
          count={selectedCount}
          values={{ plural: selectedCount === 1 ? '' : 's' }}
        />
      </p>

      <ul className="usa-list usa-list--unstyled">
        <TruncatedContent
          initialCount={2}
          expanded={recipientsCount === 0}
          hideToggle={recipientsCount === 0}
          labelMore={t(`emailRecipientFields.showMore`, {
            number: recipientsCount,
            plural: recipientsCount > 1 ? 's' : ''
          })}
          labelLess={t(`emailRecipientFields.showFewer`, {
            number: recipientsCount,
            plural: recipientsCount > 1 ? 's' : ''
          })}
          buttonClassName="margin-top-2"
        >
          <li>
            <Controller
              name="notifyEuaIds"
              control={control}
              render={({ field }) => {
                const { component } = requester;
                const { commonName, euaUserId } = requester?.userInfo || {};

                const label = `${commonName}, ${
                  cmsDivisionsAndOffices.find(value => value.name === component)
                    ?.acronym
                } (${t('Requester')})`;

                const value = euaUserId || '';

                return (
                  <CheckboxField
                    id={`${field.name}.0`}
                    label={label}
                    {...{ ...field, ref: null }}
                    onChange={e => {
                      field.onChange(
                        toggleArrayValue(field.value, e.target.value)
                      );
                    }}
                    value={value}
                    checked={field.value.includes(value)}
                  />
                );
              }}
            />
          </li>

          <li>
            <Controller
              name="copyTrbMailbox"
              control={control}
              render={({ field }) => {
                return (
                  <CheckboxField
                    id={field.name}
                    label={t('emailRecipientFields.copyTrbMailbox')}
                    {...{ ...field, ref: null }}
                    value="true"
                    checked={!!field.value}
                  />
                );
              }}
            />
          </li>

          {fields.map((recipientField, index) => {
            return (
              <Controller
                key={recipientField.id}
                name={`recipients.${index}`}
                control={control}
                render={({ field: recipient }) => {
                  const { id, userInfo, role } = recipient.value;

                  if (id) {
                    return (
                      <Controller
                        name="notifyEuaIds"
                        control={control}
                        render={({ field }) => {
                          const label = `${userInfo?.commonName} (${t(
                            `attendees.contactRoles.${role}`
                          )})`;

                          const value = userInfo?.euaUserId || '';

                          return (
                            <CheckboxField
                              id={`${field.name}.${index + 1}`}
                              label={label}
                              {...{ ...field, ref: null }}
                              onChange={e => {
                                field.onChange(
                                  toggleArrayValue(field.value, e.target.value)
                                );
                              }}
                              value={value}
                              checked={field.value.includes(value)}
                            />
                          );
                        }}
                      />
                    );
                  }

                  return (
                    <li>
                      <Fieldset>
                        <Controller
                          name={`recipients.${index}.userInfo`}
                          control={control}
                          render={({ field, fieldState: { error } }) => {
                            return (
                              <FormGroup
                                error={!!error}
                                className="margin-top-2"
                              >
                                <Label
                                  htmlFor={field.name}
                                  className="text-normal"
                                >
                                  {t('emailRecipientFields.newRecipientName')}
                                </Label>
                                {error && (
                                  <ErrorMessage>
                                    {t(error.message || 'errors.makeSelection')}
                                  </ErrorMessage>
                                )}
                                <CedarContactSelect
                                  id={field.name}
                                  {...{ ...field, ref: null }}
                                  // value={null}
                                  className="maxw-none"
                                />
                              </FormGroup>
                            );
                          }}
                        />

                        <Controller
                          name={`recipients.${index}.component`}
                          control={control}
                          render={({ field, fieldState: { error } }) => {
                            return (
                              <FormGroup
                                error={!!error}
                                className="margin-top-2"
                              >
                                <Label
                                  htmlFor={field.name}
                                  className="text-normal"
                                >
                                  {t(
                                    'emailRecipientFields.newRecipientComponent'
                                  )}
                                </Label>
                                {error && (
                                  <ErrorMessage>
                                    {t('errors.makeSelection')}
                                  </ErrorMessage>
                                )}
                                <Dropdown
                                  id={field.name}
                                  {...field}
                                  ref={null}
                                  value={field.value || ''}
                                >
                                  <option
                                    label={`- ${t('basic.options.select')} -`}
                                    disabled
                                  />
                                  {cmsDivisionsAndOfficesOptions('component')}
                                </Dropdown>
                              </FormGroup>
                            );
                          }}
                        />

                        <Controller
                          name={`recipients.${index}.role`}
                          control={control}
                          render={({ field, fieldState: { error } }) => {
                            return (
                              <FormGroup
                                error={!!error}
                                className="margin-top-2"
                              >
                                <Label
                                  htmlFor={field.name}
                                  className="text-normal"
                                >
                                  {t('emailRecipientFields.newRecipientRole')}
                                </Label>
                                {error && (
                                  <ErrorMessage>
                                    {t('errors.makeSelection')}
                                  </ErrorMessage>
                                )}
                                <Dropdown
                                  id={field.name}
                                  {...field}
                                  ref={null}
                                  value={field.value || ''}
                                >
                                  <option
                                    label={`- ${t('basic.options.select')} -`}
                                    disabled
                                  />
                                  {Object.keys(PersonRole).map(key => (
                                    <option
                                      key={key}
                                      value={key}
                                      label={t(`attendees.contactRoles.${key}`)}
                                    />
                                  ))}
                                </Dropdown>
                              </FormGroup>
                            );
                          }}
                        />
                        <ButtonGroup className="margin-top-3">
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            outline
                          >
                            {t('Cancel')}
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              setValue(
                                `recipients.${index}.id`,
                                recipientField.id
                              )
                            }
                            disabled={
                              !recipientField.userInfo?.euaUserId ||
                              !recipientField.role ||
                              !recipientField.component
                            }
                          >
                            {t('emailRecipientFields.addRecipient')}
                          </Button>
                        </ButtonGroup>
                      </Fieldset>
                    </li>
                  );
                }}
              />
            );
          })}
          {!watch('recipients').find(({ id }) => !id) && (
            <Button
              type="button"
              onClick={() => append(initialRecipient)}
              className="margin-top-3"
              outline
            >
              {t('emailRecipientFields.addAnotherRecipient')}
            </Button>
          )}
        </TruncatedContent>
      </ul>
    </Fieldset>
  );
};

export default Recipients;
