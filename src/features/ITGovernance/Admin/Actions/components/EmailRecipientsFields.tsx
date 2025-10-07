import React, { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';
import ContactFormModal from 'features/ITGovernance/Requester/SystemIntake/ContactDetails/_components/ContactFormModal';
import {
  GetSystemIntakeContactsQuery,
  SystemIntakeContactFragment
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import { useEasiFormContext } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import TruncatedContent from 'components/TruncatedContent';
import { IT_GOV_EMAIL, IT_INVESTMENT_EMAIL } from 'constants/externalUrls';
import isExternalEmail from 'utils/externalEmail';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import toggleArrayValue from 'utils/toggleArrayValue';

import { SystemIntakeActionFields } from './ActionForm';

type RecipientLabelProps = {
  name: string;
  email: string;
  component?: SystemIntakeContactFragment['component'];
  roles?: SystemIntakeContactFragment['roles'];
  isRequester?: boolean;
};

/** Formats recipient for checkbox label */
const RecipientLabel = ({
  name,
  email,
  component,
  roles,
  /** If true, adds "Requester" to beginning of roles list */
  isRequester
}: RecipientLabelProps) => {
  const { t } = useTranslation('intake');

  let rolesArray = (roles || []).map(role =>
    t(`contactDetails.systemIntakeContactRoles.${role}`)
  );

  if (isRequester) {
    rolesArray = [t('Requester'), ...rolesArray];
  }

  const commaSeparatedRoles = rolesArray.join(', ');

  return (
    <>
      <span>
        {getPersonNameAndComponentAcronym(name, component)}
        {commaSeparatedRoles && ` (${commaSeparatedRoles})`}
      </span>
      {email && <span className="display-block text-base-dark">{email}</span>}
    </>
  );
};

const RecipientCheckboxField = ({
  userAccount: { commonName, email },
  component,
  roles,
  isRequester
}: SystemIntakeContactFragment) => {
  return (
    <Controller
      name="notificationRecipients.regularRecipientEmails"
      render={({ field: { ref, ...field } }) => {
        return (
          <CheckboxField
            {...field}
            id={`recipient_${email}`}
            value={email}
            checked={field.value.includes(email)}
            onChange={e =>
              field.onChange(toggleArrayValue(field.value, e.target.value))
            }
            label={
              <RecipientLabel
                name={commonName}
                email={email}
                component={component}
                roles={roles}
                isRequester={isRequester}
              />
            }
          />
        );
      }}
    />
  );
};

type EmailRecipientsFieldsProps = {
  systemIntakeId: string;
  contacts: NonNullable<GetSystemIntakeContactsQuery['systemIntakeContacts']>;
  className?: string;
};

/** Email recipient fields for IT Governance admin actions */
const EmailRecipientsFields = ({
  systemIntakeId,
  contacts: { requester, allContacts },
  className
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');

  const [isContactsFormModalOpen, setIsContactsFormModalOpen] = useState(false);

  const {
    watch,
    setValue,
    formState: { defaultValues, errors }
  } = useEasiFormContext<SystemIntakeActionFields>();

  const recipients = watch('notificationRecipients');

  const regularRecipientEmails = watch(
    'notificationRecipients.regularRecipientEmails'
  );

  const selectedRecipientsCount = Object.values(recipients)
    .flat()
    .filter(value => value).length;

  const contactsArrayWithoutRequester = useMemo(
    () => allContacts.filter(contact => contact.id !== requester?.id),
    [allContacts, requester]
  );

  /** Returns true if a recipient with an external email has been selected */
  const hasExternalRecipients: boolean = useMemo(
    () => !!regularRecipientEmails.find(email => isExternalEmail(email)),
    [regularRecipientEmails]
  );

  const defaultRecipients = defaultValues?.notificationRecipients;

  return (
    <>
      <ContactFormModal
        type="recipient"
        systemIntakeId={systemIntakeId}
        isOpen={isContactsFormModalOpen}
        closeModal={() => setIsContactsFormModalOpen(false)}
        createContactCallback={contact => {
          setValue('notificationRecipients.regularRecipientEmails', [
            ...regularRecipientEmails,
            contact.userAccount.email
          ]);
        }}
      />

      <div className={classnames(className)} id="grtActionEmailRecipientFields">
        <FieldGroup error={!!errors.notificationRecipients?.message}>
          <h4 className="margin-bottom-0 margin-top-2">
            {t('emailRecipients.chooseRecipients')}
          </h4>
          <p className="margin-top-05">
            <Trans
              i18nKey="action:recipientsSelected"
              count={selectedRecipientsCount}
            />
          </p>

          <ErrorMessage
            errors={errors}
            name="notificationRecipients"
            as={<FieldErrorMsg />}
          />

          {requester && <RecipientCheckboxField {...requester} />}

          <Controller
            name="notificationRecipients.shouldNotifyITGovernance"
            render={({ field: { ref, ...field } }) => (
              <CheckboxField
                {...field}
                id="shouldNotifyITGovernance"
                checked={field.value}
                label={
                  <RecipientLabel
                    name={t('itGovernance')}
                    email={IT_GOV_EMAIL}
                  />
                }
              />
            )}
          />

          <div id="EmailRecipients-ContactsList" className="margin-bottom-4">
            <TruncatedContent
              // Show IT investment mailbox above show more button if default
              initialCount={Number(defaultRecipients?.shouldNotifyITInvestment)}
              labelMore={itemCount =>
                t('showMoreRecipients', { count: itemCount - 2 })
              }
              labelLess={itemCount =>
                t('showFewerRecipients', { count: itemCount - 2 })
              }
              buttonClassName="margin-top-105"
            >
              {/* IT Investment - if not default */}
              {!defaultRecipients?.shouldNotifyITInvestment && (
                <Controller
                  name="notificationRecipients.shouldNotifyITInvestment"
                  render={({ field: { ref, ...field } }) => (
                    <CheckboxField
                      {...field}
                      id="shouldNotifyITInvestment"
                      checked={field.value}
                      label={
                        <RecipientLabel
                          name={t('itInvestment')}
                          email={IT_INVESTMENT_EMAIL}
                        />
                      }
                    />
                  )}
                />
              )}

              {contactsArrayWithoutRequester.map(contact => (
                <RecipientCheckboxField key={contact.id} {...contact} />
              ))}

              {hasExternalRecipients && (
                <Alert type="warning" className="margin-bottom-3" slim>
                  {t('action:selectExternalRecipientWarning')}
                </Alert>
              )}

              <Button
                type="button"
                onClick={() => setIsContactsFormModalOpen(true)}
                outline
                className="margin-top-0"
              >
                {t('intake:contactDetails.additionalContacts.add', {
                  type: 'recipient'
                })}
              </Button>
            </TruncatedContent>
          </div>
        </FieldGroup>
      </div>
    </>
  );
};

export default EmailRecipientsFields;
