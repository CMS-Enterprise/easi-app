import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonGroup } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';

import IsGrbViewContext from '../IsGrbViewContext';

type GRBReviewProps = {
  id: string;
};

const GRBReview = ({ id }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');

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
        <UswdsReactLink
          className="usa-button"
          // TODO EASI-4332: link to add GRB reviewer form
          to="/"
        >
          {t('addGrbReviewer')}
        </UswdsReactLink>
      )}

      {/* TODO EASI-4350: add participants table */}
    </div>
  );
};

export default GRBReview;
