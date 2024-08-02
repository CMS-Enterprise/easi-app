import React, { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import useMessage from 'hooks/useMessage';
import {
  DeleteSystemIntakeGRBReviewerQuery,
  GetSystemIntakeGRBReviewersQuery
} from 'queries/SystemIntakeGRBReviewerQueries';
import {
  DeleteSystemIntakeGRBReviewer,
  DeleteSystemIntakeGRBReviewerVariables
} from 'queries/types/DeleteSystemIntakeGRBReviewer';
import { SystemIntakeGRBReviewer } from 'queries/types/SystemIntakeGRBReviewer';
import { SystemIntakeState } from 'types/graphql-global-types';

import IsGrbViewContext from '../IsGrbViewContext';
import { ReviewerKey } from '../subNavItems';

import GRBReviewerForm from './GRBReviewerForm';

type GRBReviewProps = {
  id: string;
  state: SystemIntakeState;
  grbReviewers: SystemIntakeGRBReviewer[];
};

const GRBReview = ({ id, state, grbReviewers }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');
  const { pathname } = useLocation();
  const history = useHistory();

  const { reviewerType, action } = useParams<{
    reviewerType: ReviewerKey;
    action?: 'add' | 'edit';
  }>();

  const isForm = !!action;

  const [
    reviewerToRemove,
    setReviewerToRemove
  ] = useState<SystemIntakeGRBReviewer | null>(null);

  const { showMessage } = useMessage();

  const isGrbView = useContext(IsGrbViewContext);

  const [mutate] = useMutation<
    DeleteSystemIntakeGRBReviewer,
    DeleteSystemIntakeGRBReviewerVariables
  >(DeleteSystemIntakeGRBReviewerQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersQuery,
        variables: { id }
      }
    ]
  });

  const removeGRBReviewer = (reviewer: SystemIntakeGRBReviewer) => {
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
      history.push(`/${reviewerType}/${id}/grb-review`);
    }
  };

  return (
    <>
      {!!reviewerToRemove && (
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
      )}

      {isForm ? (
        <GRBReviewerForm
          setReviewerToRemove={setReviewerToRemove}
          grbReviewers={grbReviewers}
        />
      ) : (
        <>
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
          {/* Participants table */}
          <h2 className="margin-bottom-0">{t('participants')}</h2>
          <p className="margin-top-05 line-height-body-5">
            {t('participantsText')}
          </p>
          {isGrbView ? (
            // GRB Reviewer documentation links
            <div className="bg-base-lightest padding-2">
              <h4 className="margin-top-0 margin-bottom-1">
                {t('availableDocumentation')}
              </h4>
              <ButtonGroup>
                <UswdsReactLink
                  to={`/governance-review-board/${id}/business-case`}
                  className="margin-right-3"
                >
                  {t('viewBusinessCase')}
                </UswdsReactLink>
                <UswdsReactLink
                  to={`/governance-review-board/${id}/intake-request`}
                  className="margin-right-3"
                >
                  {t('viewIntakeRequest')}
                </UswdsReactLink>
                <UswdsReactLink to={`/governance-review-board/${id}/documents`}>
                  {t('viewOtherDocuments')}
                </UswdsReactLink>
              </ButtonGroup>
            </div>
          ) : (
            // Add GRB reviewer button
            <div className="desktop:display-flex flex-align-center">
              <Button
                type="button"
                onClick={() => history.push(`${pathname}/add`)}
                disabled={state === SystemIntakeState.CLOSED}
              >
                {t(
                  grbReviewers.length > 0
                    ? 'addAnotherGrbReviewer'
                    : 'addGrbReviewer'
                )}
              </Button>
              {state === SystemIntakeState.CLOSED && (
                <p className="desktop:margin-y-0 desktop:margin-left-1">
                  <Trans
                    i18nKey="grbReview:closedRequest"
                    components={{
                      a: (
                        <UswdsReactLink
                          to={`/governance-review-team/${id}/resolutions/re-open-request`}
                        >
                          re-open
                        </UswdsReactLink>
                      )
                    }}
                  />
                </p>
              )}
            </div>
          )}
          {/**
           * TODO EASI-4350: add participants table
           *
           * This list of reviewers is temporary for testing purposes
           */}
          <ul>
            {grbReviewers.map(reviewer => {
              return (
                <li key={reviewer.id}>
                  <span>
                    {reviewer.userAccount.commonName} (
                    {t(`votingRoles.${reviewer.votingRole}`)}) -{' '}
                    {t(`reviewerRoles.${reviewer.grbRole}`)}
                  </span>
                  <ButtonGroup>
                    <Button
                      type="button"
                      onClick={() => history.push(`${pathname}/edit`, reviewer)}
                      unstyled
                    >
                      {t('Edit')}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setReviewerToRemove(reviewer)}
                      className="text-error"
                      unstyled
                    >
                      {t('Remove')}
                    </Button>
                  </ButtonGroup>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default GRBReview;
