import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormGroup, Grid, Label } from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewDocument,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewType,
  SystemIntakeStatusAdmin,
  useStartGRBReviewMutation,
  useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import UswdsReactLink from 'components/LinkWrapper';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { GRBReviewFormStepProps } from 'types/grbReview';
import { formatEndOfDayDeadline } from 'utils/date';
import { SetGRBParticipantsAsyncSchema } from 'validations/grbReviewSchema';

import getGRBReviewStatus from '../../GRBReviewStatusCard/_utils/getGRBReviewStatus';
import ParticipantsTable from '../../ParticipantsSection/_components/ParticipantsTable';
import GRBReviewFormStepWrapper, {
  GRBReviewFormStepSubmit
} from '../GRBReviewFormStepWrapper';

type ParticipantsFields = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  grbReviewAsyncEndDate: SystemIntakeGRBReviewFragment['grbReviewAsyncEndDate'];
  startGRBReview: boolean;
};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const { t } = useTranslation('grbReview');

  const history = useHistory();
  const { pathname } = useLocation();
  const { systemId } = useParams<{ systemId: string }>();

  const {
    grbReviewType,
    grbReviewStartedAt,
    statusAdmin,
    grbReviewAsyncStatus,
    grbReviewStandardStatus
  } = grbReview;

  const [startStandardReview] = useStartGRBReviewMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument]
  });

  const [startAsyncReview] =
    useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation({
      refetchQueries: [GetSystemIntakeGRBReviewDocument]
    });

  const form = useEasiForm<ParticipantsFields>({
    resolver:
      grbReviewType === SystemIntakeGRBReviewType.ASYNC
        ? yupResolver(SetGRBParticipantsAsyncSchema)
        : undefined,
    defaultValues: {
      grbReviewers: grbReview.grbVotingInformation?.grbReviewers,
      grbReviewAsyncEndDate: grbReview.grbReviewAsyncEndDate || '',
      startGRBReview: false
    },
    values: {
      grbReviewers: grbReview.grbVotingInformation?.grbReviewers,
      grbReviewAsyncEndDate: grbReview.grbReviewAsyncEndDate || '',
      startGRBReview: false
    }
  });
  const {
    control,
    formState: { errors }
  } = form;

  const onSubmit: GRBReviewFormStepSubmit<ParticipantsFields> = async input => {
    if (grbReviewType === SystemIntakeGRBReviewType.STANDARD) {
      return startStandardReview({
        variables: {
          input: {
            systemIntakeID: grbReview.id
          }
        }
      });
    }
    return startAsyncReview({
      variables: {
        input: {
          systemIntakeID: grbReview.id,
          grbReviewAsyncEndDate: input.grbReviewAsyncEndDate ?? '',
          startGRBReview: input.startGRBReview
        }
      }
    });
  };

  const showCantStartAlert = useMemo(() => {
    const status = getGRBReviewStatus(
      grbReviewAsyncStatus || grbReviewStandardStatus,
      grbReviewStartedAt
    );

    return (
      status === 'NOT_STARTED' &&
      statusAdmin !== SystemIntakeStatusAdmin.GRB_MEETING_READY
    );
  }, [
    grbReviewAsyncStatus,
    grbReviewStartedAt,
    grbReviewStandardStatus,
    statusAdmin
  ]);

  return (
    <EasiFormProvider<ParticipantsFields> {...form}>
      <GRBReviewFormStepWrapper<ParticipantsFields>
        grbReview={grbReview}
        onSubmit={onSubmit}
        requiredFields={grbReviewType === SystemIntakeGRBReviewType.ASYNC}
        startGRBReview
      >
        {
          // Only show alert for standard review type
          grbReviewType === SystemIntakeGRBReviewType.STANDARD && (
            <Alert type="info" slim>
              {t('setUpGrbReviewForm.participants.standardAlert')}
            </Alert>
          )
        }

        <FormGroup error={!!errors.grbReviewers} className="margin-top-0">
          <Grid col={12} tablet={{ col: 6 }}>
            <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
              <h4 className="margin-y-0">
                {t('setUpGrbReviewForm.participants.grbReviewers.heading')}
                {grbReviewType === SystemIntakeGRBReviewType.ASYNC && (
                  <RequiredAsterisk />
                )}
              </h4>

              <ErrorMessage
                errors={errors}
                name="grbReviewers"
                as={FieldErrorMsg}
              />

              <p className="margin-y-0 text-base-dark line-height-sans-4">
                {t('setUpGrbReviewForm.participants.grbReviewers.description')}
              </p>
              <Button
                type="button"
                onClick={() =>
                  history.push({
                    pathname: `${pathname.replace('participants', 'add')}`,
                    search: 'from-grb-setup'
                  })
                }
                outline={
                  grbReview.grbVotingInformation?.grbReviewers.length > 0
                }
              >
                {t(
                  grbReview.grbVotingInformation?.grbReviewers.length > 0
                    ? 'addAnotherGrbReviewer'
                    : 'addGrbReviewer'
                )}
              </Button>
            </div>
          </Grid>
          <Grid col={12} tablet={{ col: 10 }}>
            <ParticipantsTable
              grbReviewers={grbReview.grbVotingInformation?.grbReviewers}
              fromGRBSetup
              showParticipantEditButton
            />
          </Grid>
        </FormGroup>
        {grbReviewType === SystemIntakeGRBReviewType.ASYNC && (
          <Grid col={12} tablet={{ col: 6 }}>
            <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
              <h4 className="margin-y-0">
                {t('setUpGrbReviewForm.participants.timeframe.heading')}
              </h4>
              <p className="margin-top-0 margin-bottom-3 text-base-dark line-height-body-4">
                {t('setUpGrbReviewForm.participants.timeframe.description')}
              </p>

              <Controller
                control={control}
                name="grbReviewAsyncEndDate"
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <>
                    <FormGroup
                      error={!!errors.grbReviewAsyncEndDate}
                      className="margin-top-0"
                    >
                      <Label
                        htmlFor={field.name}
                        className="text-normal"
                        requiredMarker
                      >
                        {t(
                          'setUpGrbReviewForm.participants.selectReviewEndDate.heading'
                        )}
                      </Label>

                      {!!error && (
                        <FieldErrorMsg>
                          {t('setUpGrbReviewForm.invalidDate')}
                        </FieldErrorMsg>
                      )}
                      <HelpText
                        id="selectReviewEndDateHelpText"
                        className="line-height-sans-4 margin-top-1"
                      >
                        {t(
                          'setUpGrbReviewForm.participants.selectReviewEndDate.description'
                        )}
                      </HelpText>

                      <DatePickerFormatted
                        id="grbReviewAsyncEndDate"
                        {...field}
                        dateInPastWarning
                        value={field.value ?? ''}
                        aria-describedby="selectReviewEndDateHelpText"
                        onChange={date => {
                          if (date !== field.value) {
                            field.onChange(date || ''); // Only update when there's a change
                          }
                        }}
                        format={formatEndOfDayDeadline}
                      />
                    </FormGroup>
                  </>
                )}
              />
            </div>
          </Grid>
        )}

        {/* Show alert if review cannot be started yet */}
        {showCantStartAlert && (
          <Alert
            type="warning"
            slim
            className="margin-top-8 margin-bottom-neg-4"
            data-testid="cant-start-alert"
          >
            <Trans
              i18nKey="grbReview:form.cantStartAlert"
              tOptions={{ context: grbReviewType }}
              components={{
                link1: (
                  <UswdsReactLink to={`/it-governance/${systemId}/actions`}>
                    actions link
                  </UswdsReactLink>
                )
              }}
            />
          </Alert>
        )}
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
