import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import {
  Button,
  ButtonGroup,
  DatePicker,
  FormGroup,
  Label
} from '@trussworks/react-uswds';
import { actionDateInPast } from 'features/ITGovernance/Admin/Actions/ManageLcid/RetireLcid';
import {
  GetSystemIntakeDocument,
  GetSystemIntakeGRBReviewDocument,
  useExtendGRBReviewDeadlineAsyncMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import useMessage from 'hooks/useMessage';
import { formatDateUtc, formatToUTCISO } from 'utils/date';

/**
 * Displays Add Time button that triggers modal to extend the GRB review deadline
 */
const ExtendGRBAsyncReview = () => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { showMessage } = useMessage();

  const [err, setError] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [mutation] = useExtendGRBReviewDeadlineAsyncMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument, GetSystemIntakeDocument]
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

  const addTimeOrEndEarly = handleSubmit(async input => {
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
      {/* ADD TIME MODAL */}
      <Modal
        isOpen={isOpen}
        closeModal={() => resetModal()}
        className="easi-body-normal padding-bottom-1 maxw-mobile-lg height-fit-content"
      >
        <h3 className="margin-top-0 margin-bottom-0">
          {t('statusCard.addTimeModal.heading')}
        </h3>

        {err && (
          <Alert type="error" slim>
            {t('statusCard.addTimeModal.error')}
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

                <p
                  className="text-base-dark margin-y-1"
                  style={{
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {t('statusCard.addTimeModal.hint')}
                </p>

                <ErrorMessage
                  errors={errors}
                  name="grbReviewAsyncEndDate"
                  as={<FieldErrorMsg />}
                />

                {/* Uses basic DatePicker instead of DatePickerFormatted to avoid issue with e2e tests */}
                {/* DatePickerFormatted input was cycling through random dates after using cy.type() */}
                <DatePicker
                  {...field}
                  id="grbReviewAsyncEndDate"
                  className="date-picker-override"
                  onChange={val => {
                    // const formattedDate = formatEndOfDayDeadline(val || '');
                    const formattedDate = formatToUTCISO(
                      val || '',
                      'MM/dd/yyyy'
                    );
                    field.onChange(formattedDate);
                  }}
                />

                {actionDateInPast(watch('grbReviewAsyncEndDate')) && (
                  <Alert type="warning" slim>
                    {t('action:pastDateAlert')}
                  </Alert>
                )}

                {!!watch('grbReviewAsyncEndDate') && (
                  <p
                    className="text-base"
                    data-testid="grb-review-async-end-date"
                  >
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
            data-testid="addTimeModalButton"
            disabled={!watch('grbReviewAsyncEndDate')?.trim()}
            onClick={() => addTimeOrEndEarly()}
          >
            {t('statusCard.addTimeModal.addTime')}
          </Button>

          <Button
            type="button"
            className="margin-left-2"
            unstyled
            onClick={() => resetModal()}
          >
            {t('statusCard.addTimeModal.goBack')}
          </Button>
        </ButtonGroup>
      </Modal>

      {/* Modal trigger button */}
      <Button type="button" outline onClick={() => setIsOpen(true)}>
        {t('statusCard.addTime')}
      </Button>
    </>
  );
};

export default ExtendGRBAsyncReview;
