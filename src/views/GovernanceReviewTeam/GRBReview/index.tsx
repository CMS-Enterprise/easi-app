import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { SystemIntakeGRBReviewer } from 'queries/types/SystemIntakeGRBReviewer';
import { SystemIntakeState } from 'types/graphql-global-types';

import IsGrbViewContext from '../IsGrbViewContext';

type GRBReviewProps = {
  id: string;
  state: SystemIntakeState;
  grbReviewers: SystemIntakeGRBReviewer[];
};

const GRBReview = ({ id, state, grbReviewers }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');
  const { pathname } = useLocation();
  const history = useHistory();

  const isGrbView = useContext(IsGrbViewContext);

  return (
    <div>
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
                  onClick={() => null}
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
    </div>
  );
};

export default GRBReview;
