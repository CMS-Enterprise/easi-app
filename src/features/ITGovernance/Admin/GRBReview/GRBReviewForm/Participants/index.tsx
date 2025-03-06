import React, { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Grid,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewDocument,
  SystemIntakeGRBReviewerFragment,
  useDeleteSystemIntakeGRBReviewerMutation
} from 'gql/generated/graphql';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import Modal from 'components/Modal';
import RequiredAsterisk from 'components/RequiredAsterisk';
import useMessage from 'hooks/useMessage';
import { GRBReviewFormStepProps } from 'types/grbReview';

import ParticipantsTable from '../../ParticipantsSection/ParticipantsTable';
import GRBReviewFormStepWrapper from '../GRBReviewFormStepWrapper';

// TODO: Update fields type
type ParticipantsFields = {};

const Participants = ({ grbReview }: GRBReviewFormStepProps) => {
  const form = useEasiForm<ParticipantsFields>();
  const { t } = useTranslation('grbReview');

  const history = useHistory();
  const { pathname } = useLocation();
  const { showMessage } = useMessage();

  const [reviewerToRemove, setReviewerToRemove] =
    useState<SystemIntakeGRBReviewerFragment | null>(null);

  const [mutate] = useDeleteSystemIntakeGRBReviewerMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument]
  });

  const removeGRBReviewer = useCallback(
    (reviewer: SystemIntakeGRBReviewerFragment) => {
      mutate({ variables: { input: { reviewerID: reviewer.id } } })
        .then(() =>
          showMessage(
            <Trans
              i18nKey="grbReview:messages.success.remove"
              values={{ commonName: reviewer.userAccount.commonName }}
            />,
            { type: 'success' }
          )
        )
        .catch(() =>
          showMessage(t('form.messages.error.remove'), { type: 'error' })
        );

      // Reset `reviewerToRemove` to close modal
      setReviewerToRemove(null);

      // // If removing reviewer from form, go to GRB Review page
      // if (isForm) {
      //   history.push(`/it-governance/${id}/grb-review`);
      // }
    },
    [mutate, showMessage, t]
  );

  return (
    <EasiFormProvider<ParticipantsFields> {...form}>
      <GRBReviewFormStepWrapper
        grbReview={grbReview}
        onSubmit={async () => null}
      >
        {
          // Remove GRB reviewer modal
          !!reviewerToRemove && (
            <Modal
              isOpen={!!reviewerToRemove}
              closeModal={() => setReviewerToRemove(null)}
            >
              <ModalHeading>
                {t('removeModal.title', {
                  commonName: reviewerToRemove.userAccount.commonName
                })}
              </ModalHeading>
              <p>{t('removeModal.text')}</p>
              <ModalFooter>
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => removeGRBReviewer(reviewerToRemove)}
                    className="bg-error margin-right-1"
                  >
                    {t('removeModal.remove')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setReviewerToRemove(null)}
                    unstyled
                  >
                    {t('Cancel')}
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Modal>
          )
        }

        <Grid col={6}>
          <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
            <p className="text-bold margin-y-0">
              {t('setUpGrbReviewForm.step4.grbReviewers.heading')}
              <RequiredAsterisk />
            </p>
            <p className="margin-y-0 text-base-dark">
              {t('setUpGrbReviewForm.step4.grbReviewers.description')}
            </p>
            <Button
              type="button"
              onClick={() =>
                history.push(`${pathname.replace('participants', 'add')}`)
              }
              outline={grbReview.grbReviewers.length > 0}
            >
              {t(
                grbReview.grbReviewers.length > 0
                  ? 'addAnotherGrbReviewer'
                  : 'addGrbReviewer'
              )}
            </Button>
          </div>
        </Grid>
        <Grid col={10}>
          <ParticipantsTable
            grbReviewers={grbReview.grbReviewers}
            setReviewerToRemove={setReviewerToRemove}
          />
        </Grid>
        <Grid col={6}>
          <div className="margin-top-5 border-top-1px border-base-light padding-top-1">
            <p className="text-bold margin-y-0">
              {t('setUpGrbReviewForm.step4.timeframe.heading')}
            </p>
            <p className="margin-top-0 margin-bottom-3 text-base-dark">
              {t('setUpGrbReviewForm.step4.timeframe.description')}
            </p>
            <p className="margin-top-0 margin-bottom-1">
              {t('setUpGrbReviewForm.step4.selectReviewEndDate.heading')}
              <RequiredAsterisk />
            </p>
            <p className="margin-y-0 text-base-dark">
              {t('setUpGrbReviewForm.step4.selectReviewEndDate.description')}
            </p>
          </div>
        </Grid>
      </GRBReviewFormStepWrapper>
    </EasiFormProvider>
  );
};

export default Participants;
