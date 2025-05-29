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
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import { useGetRequesterUpdateEmailDataQuery } from 'gql/generated/graphql';

import CheckboxField from 'components/CheckboxField';
import Modal from 'components/Modal';

type FormValues = {
  [key: string]: boolean;
};

const AnnualEmail = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: emailData } = useGetRequesterUpdateEmailDataQuery();

  const list: Record<string, string> = t(
    'home:adminHome.GRT.requesterUpdateEmail.modal.list',
    {
      returnObjects: true
    }
  );

  const defaultValues = Object.keys(list).reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as FormValues);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues
  });

  const formValues = watch();
  const hasSelected = Object.values(formValues).some(Boolean);

  // Shared logic to extract filtered, deduplicated emails
  const getFilteredEmails = (formData: FormValues): string[] => {
    if (!emailData?.requesterUpdateEmailData) return [];

    const today = new Date();
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);

    const past120Days = new Date(today);
    past120Days.setDate(today.getDate() - 120);

    const selectedStatuses = Object.entries(formData)
      .filter(([, isChecked]) => isChecked)
      .map(([status]) => status);

    const emails = emailData.requesterUpdateEmailData
      .filter(entry => {
        const { lcidStatus, lcidExpiresAt, lcidRetiresAt } = entry;
        if (!lcidStatus) return false;

        if (selectedStatuses.includes(lcidStatus)) return true;

        if (
          selectedStatuses.includes('EXPIRING_SOON') &&
          lcidExpiresAt &&
          new Date(lcidExpiresAt) >= today &&
          new Date(lcidExpiresAt) <= in30Days
        )
          return true;

        if (
          selectedStatuses.includes('RETIRING_SOON') &&
          lcidStatus === 'RETIRED' &&
          lcidRetiresAt &&
          new Date(lcidRetiresAt) >= today &&
          new Date(lcidRetiresAt) <= in30Days
        )
          return true;

        if (
          selectedStatuses.includes('RETIRED_RECENTLY') &&
          lcidStatus === 'RETIRED' &&
          lcidRetiresAt &&
          new Date(lcidRetiresAt) >= past120Days &&
          new Date(lcidRetiresAt) < today
        )
          return true;

        return false;
      })
      .map(entry => entry.requesterEmail);

    return Array.from(new Set(emails));
  };

  // Submit button → opens mail client
  const onSubmit = (formData: FormValues) => {
    const emails = getFilteredEmails(formData);
    const bccList = encodeURIComponent(emails.join(','));
    const subject = encodeURIComponent('An update from IT Governance');

    window.location.href = `mailto:?bcc=${bccList}&subject=${subject}`;
  };

  // Copy button → copies to clipboard
  const onCopy = () => {
    const emails = getFilteredEmails(formValues);
    const emailString = emails.join(', ');

    navigator.clipboard.writeText(emailString);
  };

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
            onClick={() => setModalOpen(true)}
            className="margin-right-1"
          >
            {t('home:adminHome.GRT.requesterUpdateEmail.card.button')}
          </Button>
        </CardFooter>
      </Card>

      {/* Request Update Email Modal */}
      <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
        <ModalHeading>
          {t('home:adminHome.GRT.requesterUpdateEmail.modal.heading')}
        </ModalHeading>
        <p>{t('home:adminHome.GRT.requesterUpdateEmail.modal.content')}</p>

        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-none">
          {Object.entries(list).map(([statusKey, statusLabel]) => (
            <Controller
              key={statusKey}
              name={statusKey}
              control={control}
              render={({ field: { ref, ...field } }) => (
                <CheckboxField
                  {...field}
                  id={statusKey}
                  value={statusKey}
                  label={statusLabel}
                />
              )}
            />
          ))}

          <ModalFooter>
            <div className="display-flex flex-gap-3">
              <Button type="submit" disabled={!hasSelected}>
                {t(
                  'home:adminHome.GRT.requesterUpdateEmail.modal.openEmailButton'
                )}
              </Button>
              <Button
                type="button"
                onClick={onCopy}
                disabled={!hasSelected}
                unstyled
              >
                {t(
                  'home:adminHome.GRT.requesterUpdateEmail.modal.copyEmailButton'
                )}
              </Button>
            </div>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default AnnualEmail;
