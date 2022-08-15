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
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { SystemIntakeContactProps } from 'types/systemIntake';

type EmailRecipientsFieldsProps = {
  optional?: boolean;
  className?: string;
  headerClassName?: string;
  alertClassName?: string;
  systemIntakeId: string;
  activeContact: SystemIntakeContactProps | null;
  setActiveContact: (contact: SystemIntakeContactProps | null) => void;
};

export default ({
  optional = true,
  className,
  headerClassName,
  alertClassName,
  systemIntakeId,
  activeContact,
  setActiveContact
}: EmailRecipientsFieldsProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation('action');
  // const flags = useFlags();
  const [initialContacts] = useSystemIntakeContacts(systemIntakeId);
  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      nextFetchPolicy: 'cache-first',
      variables: {
        id: systemIntakeId
      }
    }
  );
  const isLCID = useMemo(() => pathname.endsWith('/issue-lcid'), [pathname]);

  const contacts: {
    label: string;
    email: string | null;
    defaultChecked: boolean;
  }[] = useMemo(() => {
    if (!initialContacts || !data?.systemIntake) return [];

    const requester = data?.systemIntake.requester;

    const { businessOwner, productManager } = initialContacts;

    const contactsArray = [
      {
        label: `${requester.name}, ${requester.component} (Requester)`,
        email: requester.email,
        defaultChecked: true
      },
      {
        label: 'IT Governance Mailbox',
        email: 'IT_Investments@cms.hhs.gov',
        defaultChecked: true
      },
      {
        label: 'IT Investment Mailbox',
        email: 'IT_Investments@cms.hhs.gov',
        defaultChecked: isLCID
      },
      {
        label: `${businessOwner.commonName}, ${businessOwner.component} (${businessOwner.role})`,
        email: businessOwner.email,
        defaultChecked: false
      },
      {
        label: `${productManager.commonName}, ${productManager.component} (${productManager.role})`,
        email: productManager.email,
        defaultChecked: false
      }
    ];

    if (initialContacts.isso.id) {
      contactsArray.push({
        label: `${initialContacts.isso.commonName}, ${initialContacts.isso.component} (${initialContacts.isso.role})`,
        email: initialContacts.isso.email,
        defaultChecked: false
      });
    }

    if (initialContacts?.additionalContacts.length > 0) {
      const additionalContacts = initialContacts.additionalContacts.map(
        contact => ({
          label: `${contact.commonName}, ${contact.component} (${contact.role})`,
          email: contact.email,
          defaultChecked: false
        })
      );
      contactsArray.push(...additionalContacts);
    }

    return contactsArray;
  }, [data?.systemIntake, initialContacts, isLCID]);

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
      <ul className="usa-list--unstyled margin-bottom-2">
        <TruncatedContent
          initialCount={isLCID ? 3 : 2}
          labelMore={`Show ${contacts.length - (isLCID ? 3 : 2)} more`}
          labelLess={`Show ${contacts.length - (isLCID ? 3 : 2)} less`}
          buttonClassName="margin-top-105"
        >
          {contacts.map(contact => (
            <li key={contact.label}>
              <CheckboxField
                id={`contact-${contact.label}`}
                name={`contact-${contact.label}`}
                label={contact.label}
                value={contact.label}
                onChange={() => null}
                onBlur={() => null}
                checked={contact.defaultChecked}
              />
            </li>
          ))}
        </TruncatedContent>
      </ul>
      <AdditionalContacts
        systemIntakeId={systemIntakeId}
        activeContact={activeContact}
        setActiveContact={setActiveContact}
        type="recipient"
        className="margin-bottom-4"
      />
      {/* )} */}
    </div>
  );
};
