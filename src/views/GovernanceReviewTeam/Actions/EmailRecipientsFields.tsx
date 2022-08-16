import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Alert } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AdditionalContacts from 'components/AdditionalContacts';
import CheckboxField from 'components/shared/CheckboxField';
import TruncatedContent from 'components/shared/TruncatedContent';
import useSystemIntake from 'hooks/useSystemIntake';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import {
  EmailRecipientsFieldsProps,
  FormatRecipientProps,
  RecipientObject
} from 'types/action';

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

  // Contacts query
  const [initialContacts] = useSystemIntakeContacts(systemIntakeId);
  // Get system intake from Apollo cache
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
  const formattedRecipients: RecipientObject[] = useMemo(() => {
    // If no contacts or intake, return empty array
    if (!initialContacts || !systemIntake) return [];

    /** Function to return formatted recipient object for display */
    const formatRecipient = ({
      commonName,
      component,
      email,
      role
    }: FormatRecipientProps): RecipientObject => {
      return {
        label: `${commonName}, ${component} (${role})`,
        value: email!,
        checked: email
          ? recipients.regularRecipientEmails.includes(email)
          : false
      };
    };

    // Get requester from system intake
    const requester = formatRecipient({
      commonName: systemIntake.requester.name!,
      component: systemIntake.requester.component!,
      email: systemIntake.requester.email || '',
      role: 'Requester'
    });

    // Format contacts for display
    // Legacy intake business owner, product manager, and isso come from intake vs contacts query
    const businessOwner = formatRecipient({
      commonName:
        initialContacts.businessOwner.commonName! ||
        systemIntake.businessOwner.name!,
      component:
        initialContacts.businessOwner.component! ||
        systemIntake.businessOwner.component!,
      email: initialContacts.businessOwner.email!,
      role: 'Business Owner'
    });

    const productManager = formatRecipient({
      commonName:
        initialContacts.productManager.commonName! ||
        systemIntake.productManager.name!,
      component:
        initialContacts.productManager.component! ||
        systemIntake.productManager.component!,
      email: initialContacts.productManager.email!,
      role: 'Product Manager'
    });

    const isso = formatRecipient({
      commonName: initialContacts.isso.commonName! || systemIntake?.isso.name!,
      component: initialContacts.isso.component!,
      email: initialContacts.isso.email!,
      role: 'ISSO'
    });

    // Check for additional contacts
    const additionalContacts = initialContacts?.additionalContacts.map(
      ({ commonName, component, role, email }) =>
        formatRecipient({
          commonName: commonName!,
          component,
          role,
          email: email!
        })
    );

    // Return formatted contact objects
    return [
      requester,
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
      businessOwner,
      productManager,
      ...(systemIntake.isso.isPresent ? [isso] : []),
      ...additionalContacts
    ];
  }, [initialContacts, recipients, systemIntake]);

  // Number of selected recipients
  const selectedCount = formattedRecipients.filter(({ checked }) => checked)
    .length;

  /** Update email recipients in system intake */
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
      <h4 className="margin-bottom-0 margin-top-2">Choose recipients</h4>
      <p className="margin-top-05">
        <strong>{selectedCount}</strong>
        {t(selectedCount > 1 ? ' recipients selected' : ' recipient selected')}
      </p>
      <div id="EmailRecipients-ContactsList" className="margin-bottom-4">
        <TruncatedContent
          initialCount={defaultITInvestment ? 3 : 2}
          labelMore={`Show ${
            formattedRecipients.length - (defaultITInvestment ? 3 : 2)
          } more recipients`}
          labelLess={`Show ${
            formattedRecipients.length - (defaultITInvestment ? 3 : 2)
          } fewer recipients`}
          buttonClassName="margin-top-105"
        >
          {formattedRecipients.map(contact => (
            <div key={contact.label}>
              <CheckboxField
                key={contact.label}
                id={`contact-${contact.label}`}
                name={`contact-${contact.label}`}
                label={contact.label}
                value={contact.value!}
                onChange={e => updateRecipients(e.target.value)}
                onBlur={() => null}
                checked={contact.value ? contact.checked : false}
                disabled={!contact.value}
              />
              {!contact.value && (
                <Alert
                  type="warning"
                  slim
                  className="margin-left-4 margin-top-05"
                >
                  This contact has an invalid email. You can’t add them as a
                  recipient.
                </Alert>
              )}
            </div>
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
