import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AdditionalContacts from 'components/AdditionalContacts';
import CheckboxField from 'components/shared/CheckboxField';
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

const getRequester = () => {
  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      nextFetchPolicy: 'cache-first',
      variables: {
        id: systemIntakeId
      }
    }
  );
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

  const contacts: { label: string; email: string | null }[] = useMemo(() => {
    if (!initialContacts || !data?.systemIntake) return [];

    const requester = data?.systemIntake.requester;

    const { businessOwner, productManager } = initialContacts;

    const contactsArray = [
      {
        label: `${requester.name}, ${requester.component} (Requester)`,
        email: requester.email
      },
      {
        label: 'IT Governance Mailbox',
        email: 'IT_Investments@cms.hhs.gov'
      },
      {
        label: 'IT Investment Mailbox',
        email: 'IT_Investments@cms.hhs.gov'
      },
      {
        label: `${businessOwner.commonName}, ${businessOwner.component} (${businessOwner.role})`,
        email: businessOwner.email
      },
      {
        label: `${productManager.commonName}, ${productManager.component} (${productManager.role})`,
        email: productManager.email
      }
    ];

    if (initialContacts.isso.id) {
      contactsArray.push({
        label: `${initialContacts.isso.commonName}, ${initialContacts.isso.component} (${initialContacts.isso.role})`,
        email: initialContacts.isso.email
      });
    }

    if (initialContacts?.additionalContacts.length > 0) {
      const additionalContacts = initialContacts.additionalContacts.map(
        contact => ({
          label: `${contact.commonName}, ${contact.component} (${contact.role})`,
          email: contact.email
        })
      );
      contactsArray.push(...additionalContacts);
    }

    return contactsArray;
  }, [data?.systemIntake, initialContacts]);

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
      <ul className="usa-list--unstyled">
        {contacts.map(contact => (
          <li key={contact.label}>
            <CheckboxField
              id={`contact-${contact.label}`}
              name={`contact-${contact.label}`}
              label={contact.label}
              value={contact.label}
              onChange={() => null}
              onBlur={() => null}
            />
          </li>
        ))}
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
