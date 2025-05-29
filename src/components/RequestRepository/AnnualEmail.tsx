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

import CheckboxField from 'components/CheckboxField';
import Modal from 'components/Modal';

type FormValues = {
  [key: string]: boolean;
};

const AnnualEmail = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const [modalOpen, setModalOpen] = useState(false);

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

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues
  });

  const onSubmit = (data: FormValues) => {
    console.log('Selected options:', data);
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
              <Button type="submit">
                {t(
                  'home:adminHome.GRT.requesterUpdateEmail.modal.openEmailButton'
                )}
              </Button>
              <Button
                type="button"
                // TODO: copy emails to clipboard
                onClick={() => setModalOpen(false)}
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
