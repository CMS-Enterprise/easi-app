import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
import {
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeState
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';

import ITGovAdminContext from '../../../../../wrappers/ITGovAdminContext/ITGovAdminContext';
import { useRestartReviewModal } from '../RestartReviewModal/RestartReviewModalContext';

import ParticipantsTable from './_components/ParticipantsTable';

type ParticipantsSectionProps = {
  id: string;
  state: SystemIntakeState;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  grbReviewStartedAt?: string | null;
  asyncStatus?: SystemIntakeGRBReviewAsyncStatusType | null;
};

/**
 * Participants section used in GRB Review tab
 */
const ParticipantsSection = ({
  id,
  state,
  grbReviewers,
  grbReviewStartedAt,
  asyncStatus
}: ParticipantsSectionProps) => {
  const { t } = useTranslation('grbReview');

  const history = useHistory();

  const { pathname } = useLocation();

  const isITGovAdmin = useContext(ITGovAdminContext);

  const { openModal } = useRestartReviewModal();

  return (
    <>
      <h2 className="margin-bottom-0" id="participants">
        {t('participants')}
      </h2>

      <p className="margin-top-05 line-height-body-5">
        {t('participantsText')}
      </p>

      {isITGovAdmin ? (
        /* IT Gov Admin view */
        <>
          <div className="desktop:display-flex flex-align-center">
            <Button
              type="button"
              onClick={() => history.push(`${pathname}/add`)}
              disabled={
                state === SystemIntakeState.CLOSED ||
                asyncStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED
              }
              outline={grbReviewers?.length > 0}
            >
              {t(
                grbReviewers?.length > 0
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
                        to={`/it-governance/${id}/resolutions/re-open-request`}
                      >
                        re-open
                      </UswdsReactLink>
                    )
                  }}
                />
              </p>
            )}
            {asyncStatus === SystemIntakeGRBReviewAsyncStatusType.COMPLETED && (
              <p className="desktop:margin-y-0 desktop:margin-left-1">
                <Trans
                  i18nKey="grbReview:asyncCompleted.reviewers"
                  components={{
                    link1: (
                      <Button type="button" unstyled onClick={openModal}>
                        {t('restartReview')}
                      </Button>
                    )
                  }}
                />
              </p>
            )}
          </div>

          {state === SystemIntakeState.OPEN && !grbReviewStartedAt && (
            <Alert type="info" slim>
              <Trans
                i18nKey="grbReview:participantsStartReviewAlert"
                components={{
                  a: (
                    <HashLink to="#startGrbReview" className="usa-link">
                      Start GRB Review
                    </HashLink>
                  )
                }}
              />
            </Alert>
          )}
        </>
      ) : (
        /* GRB Reviewer view */
        <div className="bg-base-lightest padding-2">
          <h4 className="margin-top-0 margin-bottom-1">
            {t('availableDocumentation')}
          </h4>
          <ButtonGroup>
            <UswdsReactLink
              to={`/it-governance/${id}/business-case`}
              className="margin-right-3"
            >
              {t('viewBusinessCase')}
            </UswdsReactLink>
            <UswdsReactLink
              to={`/it-governance/${id}/intake-request`}
              className="margin-right-3"
            >
              {t('viewIntakeRequest')}
            </UswdsReactLink>
            <UswdsReactLink to={`/it-governance/${id}/documents`}>
              {t('viewOtherDocuments')}
            </UswdsReactLink>
          </ButtonGroup>
        </div>
      )}

      <ParticipantsTable
        grbReviewers={grbReviewers}
        asyncStatus={asyncStatus}
      />
    </>
  );
};

export default ParticipantsSection;
