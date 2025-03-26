import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { Button, ButtonGroup, FormGroup, Label } from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewDocument,
  useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import useMessage from 'hooks/useMessage';
import { formatDateUtc } from 'utils/date';

const GRBAddTimeModal = () => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { showMessage } = useMessage();

  const [err, setError] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [mutation] =
    useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation({
      refetchQueries: [GetSystemIntakeGRBReviewDocument]
    });

  const form = useEasiForm<any>({
    defaultValues: {
      grbReviewAsyncEndDate: ''
    },
    values: {
      grbReviewAsyncEndDate: ''
    }
  });
  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = form;

  const resetModal = () => {
    setError(false);
    reset();
    setIsOpen(false);
  };

  const addTime = handleSubmit(async input => {
    mutation({
      variables: {
        input: {
          systemIntakeID: systemId,
          grbReviewAsyncEndDate: input.grbReviewAsyncEndDate
        }
      }
    })
      .then(() => {
        showMessage(
          t('statusCard.addTimeModal.success', {
            date: formatDateUtc(input.grbReviewAsyncEndDate, 'MM/dd/yyyy')
          }),
          {
            type: 'success'
          }
        );
        resetModal();
      })
      .catch(() => {
        setError(true);
      });
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={() => resetModal()}
        className="easi-body-normal padding-bottom-1 overflow-visible"
      >
        <h3 className="margin-top-0 margin-bottom-0">
          {t('statusCard.addTimeModal.heading')}
        </h3>

        {err && (
          <Alert type="error" slim>
            {t('technicalAssistance:documents.upload.error')}
          </Alert>
        )}

        <p>{t('statusCard.addTimeModal.description')}</p>

        <RequiredFieldsText className="margin-top-0 font-body-sm" />

        <Controller
          control={control}
          name="grbReviewAsyncEndDate"
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <>
              <FormGroup className="margin-top-0">
                <Label htmlFor="grbReviewAsyncEndDate" requiredMarker>
                  {t('statusCard.addTimeModal.label')}
                </Label>

                <p className="text-base-dark margin-y-1">
                  {t('statusCard.addTimeModal.hint')}
                </p>

                <ErrorMessage
                  errors={errors}
                  name="grbReviewAsyncEndDate"
                  as={<FieldErrorMsg />}
                />

                <DatePickerFormatted
                  id="grbReviewAsyncEndDate"
                  {...field}
                  dateInPastWarning
                  value={field.value ?? ''}
                  onChange={date => {
                    if (date !== field.value) {
                      field.onChange(date || ''); // Only update when there's a change
                    }
                  }}
                />

                {!!watch('grbReviewAsyncEndDate') && (
                  <p className="text-base">
                    {t('statusCard.addTimeModal.newEnd', {
                      date: formatDateUtc(
                        watch('grbReviewAsyncEndDate'),
                        'MM/dd/yyyy'
                      )
                    })}
                  </p>
                )}
              </FormGroup>
            </>
          )}
        />

        <ButtonGroup className="margin-top-4">
          <Button
            type="button"
            disabled={!watch('grbReviewAsyncEndDate')?.trim()}
            onClick={() => {
              addTime();
            }}
          >
            {t('statusCard.addTimeModal.addTime')}
          </Button>

          <Button
            type="button"
            className="margin-left-2 margin-top-2"
            unstyled
            onClick={() => {
              resetModal();
            }}
          >
            {t('statusCard.addTimeModal.goBack')}
          </Button>
        </ButtonGroup>
      </Modal>

      <ButtonGroup>
        <Button
          type="button"
          outline
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {' '}
          {t('statusCard.addTime')}
        </Button>

        <Button
          type="button"
          outline
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {t('statusCard.endVoting')}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GRBAddTimeModal;
