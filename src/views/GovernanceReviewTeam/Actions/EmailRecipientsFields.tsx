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
  const { t } = useTranslation('action');
  // const flags = useFlags();
  const [initialContacts] = useSystemIntakeContacts(systemIntakeId);
  const { systemIntake } = useSystemIntake(systemIntakeId);

  // Get action type from path
  const { pathname } = useLocation();
  const defaultITInvestment = useMemo(() => {
    return (
      pathname.endsWith('issue-lcid') ||
      pathname.endsWith('extend-lcid') ||
      pathname.endsWith('no-governance')
    );
  }, [pathname]);

  /** Formatted contacts array for display as email recipients */
  const contacts: {
    label: string;
    value: string | null;
    checked: boolean;
  }[] = useMemo(() => {
    if (!initialContacts) return [];

    // Get requester from system intake
    const { requester } = { ...systemIntake };

    // Legacy intake business owner, product manager, and isso come from intake vs contacts query
    const businessOwner = {
      commonName:
        initialContacts.businessOwner.commonName ||
        systemIntake?.businessOwner.name,
      component:
        initialContacts.businessOwner.component ||
        systemIntake?.businessOwner.component,
      email: initialContacts.businessOwner.email!
    };

    const productManager = {
      commonName:
        initialContacts.productManager.commonName ||
        systemIntake?.productManager.name,
      component:
        initialContacts.productManager.component ||
        systemIntake?.productManager.component,
      email: initialContacts.productManager.email!
    };

    const isso = {
      commonName: initialContacts.isso.commonName || systemIntake?.isso.name,
      component: initialContacts.isso.component!,
      email: initialContacts.isso.email!
    };

    // Format array of contact objects for display
    const contactsArray = [
      {
        label: `${requester?.name}, ${requester?.component} (Requester)`,
        value: requester?.email || '',
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
        label: `${businessOwner.commonName}, ${businessOwner.component} (Business owner)`,
        value: businessOwner.email,
        checked: recipients.regularRecipientEmails.includes(businessOwner.email)
      },
      {
        label: `${productManager.commonName}, ${productManager.component} (Product manager)`,
        value: productManager.email,
        checked: recipients.regularRecipientEmails.includes(
          productManager.email
        )
      },
      {
        label: `${isso.commonName}${
          isso.component ? `, ${isso.component}` : ''
        } (ISSO)`,
        value: isso.email,
        checked: recipients.regularRecipientEmails.includes(isso.email)
      }
    ];

    // If additional contacts, add to array
    if (initialContacts?.additionalContacts.length > 0) {
      const additionalContacts = initialContacts.additionalContacts.map(
        contact => ({
          label: `${contact.commonName}, ${contact.component} (${contact.role})`,
          value: contact.email!,
          checked: recipients.regularRecipientEmails.includes(contact.email!)
        })
      );
      contactsArray.push(...additionalContacts);
    }

    // Return contacts array
    return contactsArray;
  }, [initialContacts, recipients, systemIntake]);

  /** Update notification recipients in system intake */
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
          initialCount={defaultITInvestment ? 3 : 2}
          labelMore={`Show ${
            contacts.length - (defaultITInvestment ? 3 : 2)
          } more recipients`}
          labelLess={`Show ${
            contacts.length - (defaultITInvestment ? 3 : 2)
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
