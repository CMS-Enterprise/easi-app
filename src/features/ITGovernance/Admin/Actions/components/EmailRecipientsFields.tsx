import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { RecipientLabel } from 'features/TechnicalAssistance/Admin/_components/ActionFormWrapper/Recipients';
import {
  EmailNotificationRecipients,
  GetSystemIntakeContactsQuery,
  SystemIntakeContactFragment
} from 'gql/generated/graphql';

import AdditionalContacts from 'components/AdditionalContacts';
import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import TruncatedContent from 'components/TruncatedContent';
import cmsComponents from 'constants/cmsComponents';
import { IT_GOV_EMAIL, IT_INVESTMENT_EMAIL } from 'constants/externalUrls';
import isExternalEmail from 'utils/externalEmail';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';

type EmailRecipientsFieldsProps = {
  optional?: boolean;
  className?: string;
  alertClassName?: string;
  systemIntakeId: string;
  activeContact: SystemIntakeContactFragment | null;
  setActiveContact: (contact: SystemIntakeContactFragment | null) => void;
  contacts: NonNullable<GetSystemIntakeContactsQuery['systemIntakeContacts']>;
  recipients: EmailNotificationRecipients;
  setRecipients: (recipients: EmailNotificationRecipients) => void;
  error: string;
};

/**
 * Email recipient fields with functionality to verify and add recipients
 */
const EmailRecipientsFields = ({
  optional = true,
  className,
  alertClassName,
  systemIntakeId,
  activeContact,
  setActiveContact,
  contacts,
  recipients,
  setRecipients,
  error
}: EmailRecipientsFieldsProps) => {
  const { t } = useTranslation('action');

  const { requester, allContacts } = contacts;

  const contactsArrayWithoutRequester = useMemo(
    () => allContacts.filter(contact => contact.id !== requester?.id),
    [allContacts, requester]
  );

  const { regularRecipientEmails } = recipients;

  /** Initial default recipients */
  const defaultRecipients: EmailNotificationRecipients =
    useRef(recipients).current;

  /** Number of selected recipients */
  const selectedCount = Object.values(recipients)
    .flat()
    .filter(value => value).length;

  /** Returns true if a recipient with an external email has been selected */
  const externalRecipients: boolean = useMemo(
    () => !!regularRecipientEmails.find(email => isExternalEmail(email)),
    [regularRecipientEmails]
  );

  /**
   * Updates email recipients in system intake
   */
  const updateRecipients = (value: string) => {
    let updatedRecipients = [];

    // Update recipients
    if (regularRecipientEmails.includes(value)) {
      // If recipient already exists, remove email from array
      updatedRecipients = regularRecipientEmails.filter(
        email => email !== value
      );
    } else {
      // Add email to recipients array
      updatedRecipients = [...regularRecipientEmails, value];
    }

    // Update recipients
    setRecipients({
      ...recipients,
      regularRecipientEmails: updatedRecipients
    });
  };

  /**
   * Number of contacts to hide behind view more button
   */
  const hiddenContactsCount =
    Number(!defaultRecipients.shouldNotifyITInvestment) +
    contactsArrayWithoutRequester.length;

  const requesterRolesList = [
    t('Requester'),
    ...(requester?.roles || []).map(role =>
      t(`intake:contactDetails.systemIntakeContactRoles.${role}`)
    )
  ].join(', ');

  return (
    <div className={classnames(className)} id="grtActionEmailRecipientFields">
      {/* Email required alert */}
      {!optional && (
        <Alert type="info" slim className={classnames(alertClassName)}>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}

      {/* Recipients list */}
      <FieldGroup error={!!error}>
        <h4 className="margin-bottom-0 margin-top-2">
          {t('emailRecipients.chooseRecipients')}
        </h4>
        <p className="margin-top-05">
          <strong>{selectedCount}</strong>
          {t(
            selectedCount > 1 ? ' recipients selected' : ' recipient selected'
          )}
        </p>
        <FieldErrorMsg>{error}</FieldErrorMsg>

        {/* Requester */}
        {requester && (
          <CheckboxField
            id={`recipient_${requester.userAccount.email}`}
            name="email-recipient"
            label={
              <RecipientLabel
                name={`${getPersonNameAndComponentAcronym(
                  requester.userAccount.commonName,
                  requester.component && cmsComponents[requester.component].name
                )} (${requesterRolesList})`}
                email={requester.userAccount.email}
              />
            }
            value={requester.userAccount.email}
            onChange={e => updateRecipients(e.target.value)}
            onBlur={() => null}
            checked={recipients.regularRecipientEmails.includes(
              requester.userAccount.email
            )}
          />
        )}

        {/* IT Governance */}
        <CheckboxField
          label={
            <RecipientLabel name={t('itGovernance')} email={IT_GOV_EMAIL} />
          }
          checked={recipients.shouldNotifyITGovernance}
          name="shouldNotifyITGovernance"
          id="shouldNotifyITGovernance"
          value="shouldNotifyITGovernance"
          onChange={e =>
            setRecipients({
              ...recipients,
              shouldNotifyITGovernance: e.target.checked
            })
          }
          onBlur={() => null}
        />

        {/* IT Investment - if default */}
        {defaultRecipients.shouldNotifyITInvestment && (
          <CheckboxField
            label={
              <RecipientLabel
                name={t('itInvestment')}
                email={IT_INVESTMENT_EMAIL}
              />
            }
            checked={recipients.shouldNotifyITInvestment}
            name="shouldNotifyITInvestment"
            id="shouldNotifyITInvestment"
            value="shouldNotifyITInvestment"
            onChange={e =>
              setRecipients({
                ...recipients,
                shouldNotifyITInvestment: e.target.checked
              })
            }
            onBlur={() => null}
          />
        )}

        <div id="EmailRecipients-ContactsList" className="margin-bottom-4">
          <TruncatedContent
            initialCount={0}
            labelMore={t(
              `Show ${
                hiddenContactsCount > 0 ? `${hiddenContactsCount} ` : ''
              }more recipients`
            )}
            labelLess={t(
              `Show ${
                hiddenContactsCount > 0 ? `${hiddenContactsCount} ` : ''
              }fewer recipients`
            )}
            buttonClassName="margin-top-105"
          >
            {/* IT Investment - if not default */}
            {!defaultRecipients.shouldNotifyITInvestment && (
              <CheckboxField
                label={
                  <RecipientLabel
                    name={t('itInvestment')}
                    email={IT_INVESTMENT_EMAIL}
                  />
                }
                checked={recipients.shouldNotifyITInvestment}
                name="shouldNotifyITInvestment"
                id="shouldNotifyITInvestment"
                value="shouldNotifyITInvestment"
                onChange={e =>
                  setRecipients({
                    ...recipients,
                    shouldNotifyITInvestment: e.target.checked
                  })
                }
                onBlur={() => null}
              />
            )}

            {contactsArrayWithoutRequester.map(contact => {
              const rolesList = contact.roles
                .map(role =>
                  t(`intake:contactDetails.systemIntakeContactRoles.${role}`)
                )
                .join(', ');

              const componentString =
                contact.component && cmsComponents[contact.component].name;

              return (
                <CheckboxField
                  key={contact.id}
                  id={`recipient_${contact.userAccount.email}`}
                  name="email-recipient"
                  label={
                    <RecipientLabel
                      name={`${getPersonNameAndComponentAcronym(
                        contact.userAccount.commonName,
                        componentString
                      )} (${rolesList})`}
                      email={contact.userAccount.email}
                    />
                  }
                  value={contact.userAccount.email}
                  onChange={e => updateRecipients(e.target.value)}
                  onBlur={() => null}
                  checked={recipients.regularRecipientEmails.includes(
                    contact.userAccount.email
                  )}
                />
              );
            })}
            {/* Additional Contacts button/form */}
            <AdditionalContacts
              systemIntakeId={systemIntakeId}
              activeContact={activeContact}
              setActiveContact={setActiveContact}
              showExternalUsersWarning={externalRecipients}
              // Add new contact to recipients array
              createContactCallback={contact =>
                setRecipients({
                  ...recipients,
                  regularRecipientEmails: [
                    ...recipients.regularRecipientEmails,
                    contact.userAccount.email
                  ]
                })
              }
              type="recipient"
              className="margin-top-3"
            />
          </TruncatedContent>
        </div>
      </FieldGroup>
    </div>
  );
};

export default EmailRecipientsFields;
