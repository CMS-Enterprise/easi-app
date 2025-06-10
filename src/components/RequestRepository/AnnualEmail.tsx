import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Icon,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import { useGetRequesterUpdateEmailDataQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import Modal from 'components/Modal';

// Define all possible status keys
type StatusKey =
  | 'ISSUED'
  | 'EXPIRED'
  | 'RETIRED'
  | 'EXPIRING_SOON'
  | 'RETIRING_SOON'
  | 'RETIRED_RECENTLY';

// Strongly typed form values
type FormValues = Record<StatusKey, boolean>;

// Typed helper to get entries with strong keys
function typedEntries<T extends Record<string, any>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

const AnnualEmail = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const [modalOpen, setModalOpen] = useState(false);
  const [warning, setWarning] = useState(false);

  const {
    data: emailData,
    loading,
    error
  } = useGetRequesterUpdateEmailDataQuery();

  const list: Record<StatusKey, string> = t(
    'home:adminHome.GRT.requesterUpdateEmail.modal.list',
    {
      returnObjects: true
    }
  ) as Record<StatusKey, string>;

  const defaultValues = typedEntries(list).reduce((acc, [key]) => {
    acc[key] = false;
    return acc;
  }, {} as FormValues);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues
  });

  const formValues = watch();
  const hasSelected = Object.values(formValues).some(Boolean);

  // Returns a deduplicated list of requester emails based on selected statuses and LCID dates
  const getFilteredEmails = (formData: FormValues): string[] => {
    // Early return if email data is unavailable
    if (!emailData?.requesterUpdateEmailData) return [];

    // Define today's date
    const today = new Date();

    // Define the date 120 days from today
    const in120Days = new Date(today);
    in120Days.setDate(today.getDate() + 120);

    // Define the date 120 days before today
    const past120Days = new Date(today);
    past120Days.setDate(today.getDate() - 120);

    // Extract statuses that the user has checked in the form
    const selectedStatuses = typedEntries(formData)
      .filter(([, isChecked]) => isChecked)
      .map(([status]) => status);

    // Filter and collect emails that match the selected status criteria
    const emails = emailData.requesterUpdateEmailData
      .filter(entry => {
        const { lcidStatus, lcidExpiresAt, lcidRetiresAt } = entry;

        // Case 1: Match selected LCID status directly (excluding 'ISSUED' with retirement date)
        if (
          lcidStatus &&
          selectedStatuses.includes(lcidStatus as StatusKey) &&
          !(lcidStatus === 'ISSUED' && lcidRetiresAt)
        ) {
          return true;
        }

        // Case 2: Expiring soon — LCID expiration is within the next 120 days
        if (
          selectedStatuses.includes('EXPIRING_SOON') &&
          lcidExpiresAt &&
          new Date(lcidExpiresAt) >= today &&
          new Date(lcidExpiresAt) <= in120Days
        ) {
          return true;
        }

        // Case 3: Retiring soon — Status is 'ISSUED' and has a retirement date
        if (
          selectedStatuses.includes('RETIRING_SOON') &&
          lcidStatus === 'ISSUED' &&
          lcidRetiresAt
        ) {
          return true;
        }

        // Case 4: Retired recently — Status is 'RETIRED' and retirement date was within the past 120 days
        if (
          selectedStatuses.includes('RETIRED_RECENTLY') &&
          lcidStatus === 'RETIRED' &&
          lcidRetiresAt &&
          new Date(lcidRetiresAt) >= past120Days &&
          new Date(lcidRetiresAt) < today
        ) {
          return true;
        }

        // Default: entry doesn't match any selected status
        return false;
      })
      // Extract requester emails from the filtered entries
      .map(entry => entry.requesterEmail);

    // Return a deduplicated list of emails
    return Array.from(new Set(emails));
  };

  const handleEmails = (formData: FormValues, action: 'submit' | 'copy') => {
    const emails = getFilteredEmails(formData);

    if (emails.length === 0) {
      setWarning(true);
      return;
    }

    setWarning(false);

    const emailString = emails.join(', ');

    if (action === 'submit') {
      const bccList = encodeURIComponent(emailString);
      const subject = encodeURIComponent('An update from IT Governance');
      window.location.href = `mailto:?bcc=${bccList}&subject=${subject}`;
    } else if (action === 'copy') {
      navigator.clipboard.writeText(emailString);
    }
  };

  const onSubmit = (formData: FormValues) => handleEmails(formData, 'submit');
  const onCopy = () => handleEmails(formValues, 'copy');

  return (
    <>
      <Card
        containerProps={{
          className: 'radius-0 border-gray-10 shadow-3'
        }}
        gridLayout={{
          tablet: {
            col: 6
          }
        }}
      >
        <CardHeader>
          <h4>{t('home:adminHome.GRT.requesterUpdateEmail.card.heading')}</h4>
        </CardHeader>
        <CardBody>
          <p>{t('home:adminHome.GRT.requesterUpdateEmail.card.content')}</p>
        </CardBody>
        <CardFooter>
          <Button
            type="button"
            onClick={() => {
              setModalOpen(true);
              setWarning(false);
            }}
            className="margin-right-1"
          >
            {t('home:adminHome.GRT.requesterUpdateEmail.card.button')}
          </Button>
        </CardFooter>
      </Card>

      <Modal
        isOpen={modalOpen}
        closeModal={() => {
          setModalOpen(false);
          setWarning(false);
        }}
      >
        <ModalHeading>
          {t('home:adminHome.GRT.requesterUpdateEmail.modal.heading')}
        </ModalHeading>
        <p>{t('home:adminHome.GRT.requesterUpdateEmail.modal.content')}</p>
        {loading && (
          <div className="display-flex flex-align-center flex-justify-space-between">
            <Icon.Autorenew className="text-base-dark" />
            <span className="margin-left-1 text-base-dark text-italic">
              {t('general:loadingData')}
            </span>
          </div>
        )}
        {error && (
          <Alert type="error" isClosable={false}>
            {t('home:adminHome.GRT.requesterUpdateEmail.modal.error')}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Form onSubmit={handleSubmit(onSubmit)} className="maxw-none">
              {typedEntries(list).map(([key, statusLabel]) => (
                <Controller
                  key={key}
                  name={key}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <CheckboxField
                      {...field}
                      id={key as string}
                      value={key as string}
                      label={statusLabel}
                      data-testid={`checkbox-${key}`}
                    />
                  )}
                />
              ))}

              {warning && (
                <Alert slim type="warning">
                  {t('home:adminHome.GRT.requesterUpdateEmail.modal.noEmail')}
                </Alert>
              )}

              <ModalFooter>
                <div className="display-flex flex-gap-3">
                  <Button
                    type="submit"
                    disabled={!hasSelected}
                    className="margin-y-0"
                  >
                    {t(
                      'home:adminHome.GRT.requesterUpdateEmail.modal.openEmailButton'
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={onCopy}
                    disabled={!hasSelected}
                    unstyled
                    className="margin-y-0"
                  >
                    {t(
                      'home:adminHome.GRT.requesterUpdateEmail.modal.copyEmailButton'
                    )}
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default AnnualEmail;
