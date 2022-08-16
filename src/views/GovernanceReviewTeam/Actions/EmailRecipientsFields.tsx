import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AdditionalContacts from 'components/AdditionalContacts';
import CheckboxField from 'components/shared/CheckboxField';
import TruncatedContent from 'components/shared/TruncatedContent';
import useSystemIntake from 'hooks/useSystemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { EmailNotificationRecipients } from 'types/graphql-global-types';
import { SystemIntakeContactProps } from 'types/systemIntake';

type EmailRecipientsFieldsProps = {
  optional?: boolean;
  className?: string;
  headerClassName?: string;
  alertClassName?: string;
  systemIntakeId: string;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
  recipients: EmailNotificationRecipients;
  setRecipients: (recipients: EmailNotificationRecipients) => void;
};

export default ({
  optional = true,
  className,
  headerClassName,
  alertClassName,
  systemIntakeId,
  activeContact,
  setActiveContact,
  recipients,
  setRecipients
}: EmailRecipientsFieldsProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation('action');
  // const flags = useFlags();
  const [initialContacts] = useSystemIntakeContacts(systemIntakeId);
  const { systemIntake } = useSystemIntake(systemIntakeId);
  const { requester } = { ...systemIntake };
  const isLCID = useMemo(() => pathname.endsWith('/issue-lcid'), [pathname]);

  const contacts: {
    label: string;
    value: string | null;
    checked: boolean;
  }[] = useMemo(() => {
    if (!initialContacts) return [];

    const { businessOwner, productManager } = initialContacts;

    const contactsArray = [
      {
        label: `${requester?.name}, ${requester?.component} (Requester)`,
        value: requester?.email!,
        checked: recipients.regularRecipientEmails.includes(requester?.email!)
      },
      {
        label: 'IT Governance Mailbox',
        value: 'shouldNotifyITGovernance',
        checked: recipients.shouldNotifyITGovernance
      },
      {
        label: 'IT Investment Mailbox',
        value: 'shouldNotifyITInvestment',
        checked: recipients.shouldNotifyITInvestment
      },
      {
        label: `${businessOwner.commonName}, ${businessOwner.component} (${businessOwner.role})`,
        value: businessOwner.email,
        checked: recipients.regularRecipientEmails.includes(
          businessOwner.email!
        )
      },
      {
        label: `${productManager.commonName}, ${productManager.component} (${productManager.role})`,
        value: productManager.email,
        checked: recipients.regularRecipientEmails.includes(
          productManager.email!
        )
      }
    ];

    if (initialContacts.isso.id) {
      contactsArray.push({
        label: `${initialContacts.isso.commonName}, ${initialContacts.isso.component} (${initialContacts.isso.role})`,
        value: initialContacts.isso.email,
        checked: recipients.regularRecipientEmails.includes(
          initialContacts.isso.email!
        )
      });
    }

    if (initialContacts?.additionalContacts.length > 0) {
      const additionalContacts = initialContacts.additionalContacts.map(
        contact => ({
          label: `${contact.commonName}, ${contact.component} (${contact.role})`,
          value: contact.email,
          checked: recipients.regularRecipientEmails.includes(contact.email!)
        })
      );
      contactsArray.push(...additionalContacts);
    }

    return contactsArray;
  }, [initialContacts, recipients, requester]);

  const updateRecipients = (value: string) => {
    const { regularRecipientEmails } = recipients;
    // Update recipients
    if (
      value === 'shouldNotifyITInvestment' ||
      value === 'shouldNotifyITGovernance'
    ) {
      // If IT Investment or IT Governance mailbox, set boolean
      setRecipients({ ...recipients, [value]: !recipients[value] });
    } else if (regularRecipientEmails.includes(value)) {
      // If recipient already exists, remove email from array
      setRecipients({
        ...recipients,
        regularRecipientEmails: regularRecipientEmails.filter(
          email => email !== value
        )
      });
    } else {
      // Add email to recipients array
      setRecipients({
        ...recipients,
        regularRecipientEmails: [...regularRecipientEmails, value]
      });
    }
  };

  return (
    <div className={classnames(className)}>
      <h3 className={classnames('margin-y-2', headerClassName)}>
        {t('emailRecipients.email')} {optional && t('emailRecipients.optional')}
      </h3>
      {!optional && (
        <Alert type="info" slim className={classnames(alertClassName)}>
          {t('emailRecipients.emailRequired')}
        </Alert>
      )}
      {/* {flags.notifyMultipleRecipients && ( */}
      <div id="EmailRecipients-ContactsList" className="margin-bottom-4">
        <TruncatedContent
          initialCount={isLCID ? 3 : 2}
          labelMore={`Show ${
            contacts.length - (isLCID ? 3 : 2)
          } more recipients`}
          labelLess={`Show ${
            contacts.length - (isLCID ? 3 : 2)
          } fewer recipients`}
          buttonClassName="margin-top-105"
        >
          {contacts.map(contact => (
            <CheckboxField
              key={contact.label}
              id={`contact-${contact.label}`}
              name={`contact-${contact.label}`}
              label={contact.label}
              value={contact.value!}
              onChange={e => updateRecipients(e.target.value)}
              onBlur={() => null}
              checked={contact.checked}
            />
          ))}
          <AdditionalContacts
            systemIntakeId={systemIntakeId}
            activeContact={activeContact}
            setActiveContact={setActiveContact}
            type="recipient"
            className="margin-top-2"
          />
        </TruncatedContent>
      </div>
    </div>
  );
};
