import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { Button, ButtonGroup, FormGroup, Label } from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewDocument,
  SystemIntakeGRBReviewFragment,
  useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import useMessage from 'hooks/useMessage';
import { formatDateUtc, formatDaysHoursMinutes } from 'utils/date';

type AddTimeOrEndVotingProps = {
  grbReviewAsyncEndDate: SystemIntakeGRBReviewFragment['grbReviewAsyncEndDate'];
  grbVotingInformation: SystemIntakeGRBReviewFragment['grbVotingInformation'];
};

const AddTimeOrEndVoting = ({
  grbReviewAsyncEndDate,
  grbVotingInformation
}: AddTimeOrEndVotingProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { showMessage } = useMessage();

  const [err, setError] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<'addTime' | 'endVoting' | null>(null);

  const [mutation] =
    useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation({
      refetchQueries: [GetSystemIntakeGRBReviewDocument]
    });

  const { days, hours, minutes } = formatDaysHoursMinutes(
    grbReviewAsyncEndDate
  );

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
    setIsOpen(null);
  };

  const addTimeOrEndEarly = handleSubmit(async input => {
    mutation({
      variables: {
        input: {
          systemIntakeID: systemId,
          grbReviewAsyncEndDate:
            isOpen === 'endVoting'
              ? new Date().toISOString()
              : input.grbReviewAsyncEndDate
        }
      }
    })
      .then(() => {
        if (isOpen === 'endVoting') {
          showMessage(t('statusCard.endVotingModal.success'), {
            type: 'success'
          });
          return;
        }
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
        isOpen={isOpen === 'addTime'}
        closeModal={() => resetModal()}
        className="easi-body-normal padding-bottom-1 overflow-visible width-mobile-lg"
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
              addTimeOrEndEarly();
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

      {/* END VOTING MODAL */}
      <Modal
        isOpen={isOpen === 'endVoting'}
        closeModal={() => resetModal()}
        className="easi-body-normal padding-bottom-1 overflow-visible width-mobile-lg"
      >
        <h3 className="margin-top-0 margin-bottom-0">
          {t('statusCard.endVotingModal.heading')}
        </h3>

        {err && (
          <Alert type="error" slim>
            {t('technicalAssistance:documents.upload.error')}
          </Alert>
        )}

        <p>{t('statusCard.endVotingModal.description')}</p>

        <p className="text-bold margin-top-1 margin-bottom-0">
          {t('statusCard.endVotingModal.timeRemaining')}
        </p>

        <p className="easi-body-large margin-top-0 margin-bottom-2 margin-right-2">
          {t('statusCard.countdown', {
            days,
            hours,
            minutes
          })}
        </p>

        <p className="text-bold margin-top-1 margin-bottom-0">
          {t('statusCard.endVotingModal.votingStatus')}
        </p>

        <p className="easi-body-large margin-top-0 margin-bottom-05 margin-right-2">
          {t('decisionCard.voteInfo', {
            noObjection: grbVotingInformation.numberOfNoObjection,
            objection: grbVotingInformation.numberOfObjection,
            notVoted: grbVotingInformation.numberOfNotVoted
          })}
        </p>

        <ButtonGroup className="margin-top-4">
          <Button
            type="button"
            secondary
            onClick={() => {
              addTimeOrEndEarly();
            }}
          >
            {t('statusCard.endVotingModal.endEarly')}
          </Button>

          <Button
            type="button"
            className="margin-left-2 margin-top-2"
            unstyled
            onClick={() => {
              resetModal();
            }}
          >
            {t('statusCard.endVotingModal.goBack')}
          </Button>
        </ButtonGroup>
      </Modal>

      <ButtonGroup>
        <Button
          type="button"
          outline
          onClick={() => {
            setIsOpen('addTime');
          }}
        >
          {' '}
          {t('statusCard.addTime')}
        </Button>

        <Button
          type="button"
          outline
          onClick={() => {
            setIsOpen('endVoting');
          }}
        >
          {t('statusCard.endVoting')}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default AddTimeOrEndVoting;
