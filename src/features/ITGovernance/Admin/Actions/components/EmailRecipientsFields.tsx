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
   * Callback after a new additional contact is created
   *
   * Adds contact as recipient and to verifiedContacts array
   */
  const createContactCallback = (contact: SystemIntakeContactFragment) => {
    // New contacts should automatically be selected as recipients
    if (
      // Check if response from CEDAR includes email
      contact.userAccount.email &&
      // Check if contact is already selected as recipient
      !recipients.regularRecipientEmails.includes(contact.userAccount.email)
    ) {
      // Add contact email to recipients array
      setRecipients({
        ...recipients,
        regularRecipientEmails: [
          ...recipients.regularRecipientEmails,
          contact.userAccount.email
        ]
      });
    }
  };

  /**
   * Number of contacts to hide behind view more button
   */
  const hiddenContactsCount =
    Number(!defaultRecipients.shouldNotifyITInvestment) +
    contactsArrayWithoutRequester.length;

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
            id={`${requester?.userAccount.username}-requester`}
            name={`${requester?.userAccount.username}-requester`}
            label={
              <RecipientLabel
                name={`${getPersonNameAndComponentAcronym(
                  requester.userAccount.commonName,
                  requester.component
                )} (Requester)`}
                email={requester.userAccount.email}
              />
            }
            value={requester?.userAccount.email || ''}
            onChange={e => updateRecipients(e.target.value)}
            onBlur={() => null}
            checked={
              !!requester?.userAccount.email &&
              recipients.regularRecipientEmails.includes(
                requester.userAccount.email
              )
            }
          />
        )}

        {/* IT Governance */}
        <CheckboxField
          label={
            <RecipientLabel name={t('itGovernance')} email={IT_GOV_EMAIL} />
          }
          checked={recipients.shouldNotifyITGovernance}
          name="contact-itGovernanceMailbox"
          id="contact-itGovernanceMailbox"
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
            name="contact-itInvestmentMailbox"
            id="contact-itInvestmentMailbox"
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
                name="contact-itInvestmentMailbox"
                id="contact-itInvestmentMailbox"
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
              return (
                <CheckboxField
                  key={contact.id}
                  id={contact.id}
                  name={`${contact.userAccount.username}-${contact.roles[0]}`}
                  label={
                    <RecipientLabel
                      name={`${getPersonNameAndComponentAcronym(
                        contact.userAccount.commonName,
                        contact.component
                      )} (${contact.roles[0]})`}
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
              createContactCallback={createContactCallback}
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
