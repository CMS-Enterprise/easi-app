import React, { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
  useDeleteSystemIntakeGRBReviewerMutation
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import { SystemIntakeState } from 'types/graphql-global-types';

import GRBReviewerForm from './GRBReviewerForm';
import ParticipantsTable from './ParticipantsTable';

type GRBReviewProps = {
  id: string;
  state: SystemIntakeState;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
};

const GRBReview = ({ id, state, grbReviewers }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');
  const history = useHistory();

  const { action } = useParams<{
    action?: 'add' | 'edit';
  }>();

  const isForm = !!action;

  const [
    reviewerToRemove,
    setReviewerToRemove
  ] = useState<SystemIntakeGRBReviewerFragment | null>(null);

  const { showMessage } = useMessage();

  const [mutate] = useDeleteSystemIntakeGRBReviewerMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id }
      }
    ]
  });

  const removeGRBReviewer = useCallback(
    (reviewer: SystemIntakeGRBReviewerFragment) => {
      mutate({ variables: { input: { reviewerID: reviewer.id } } })
        .then(() =>
          showMessage(
            <Trans
              i18nKey="grbReview:removeSuccess"
              values={{ commonName: reviewer.userAccount.commonName }}
            >
              success
            </Trans>,
            { type: 'success' }
          )
        )
        .catch(() => showMessage(t('removeError'), { type: 'error' }));

      // Reset `reviewerToRemove` to close modal
      setReviewerToRemove(null);

      // If removing reviewer from form, go to GRB Review page
      if (isForm) {
        history.push(`/it-governance/${id}/grb-review`);
      }
    },
    [history, isForm, id, mutate, showMessage, t]
  );

  return (
    <>
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

      {isForm ? (
        <GRBReviewerForm
          setReviewerToRemove={setReviewerToRemove}
          grbReviewers={grbReviewers}
        />
      ) : (
        <div className="padding-bottom-4">
          <PageHeading className="margin-y-0">{t('title')}</PageHeading>

          <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-3">
            {t('description')}
          </p>

          {/* Feature in progress alert */}
          <Alert
            type="info"
            heading={t('featureInProgress')}
            className="margin-bottom-5"
          >
            <Trans
              i18nKey="grbReview:featureInProgressText"
              components={{
                a: (
                  <UswdsReactLink to="/help/send-feedback" target="_blank">
                    feedback form
                  </UswdsReactLink>
                )
              }}
            />
          </Alert>

          <ParticipantsTable
            id={id}
            state={state}
            grbReviewers={grbReviewers}
            setReviewerToRemove={setReviewerToRemove}
          />
        </div>
      )}
    </>
  );
};

export default GRBReview;
