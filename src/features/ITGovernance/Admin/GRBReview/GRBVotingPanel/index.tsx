import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';

export type GRBVotingPanelProps = {
  grbReviewer: SystemIntakeGRBReviewerFragment;
  className?: string;
};

const GRBVotingPanel = ({ grbReviewer, className }: GRBVotingPanelProps) => {
  const { t } = useTranslation('grbReview');

  console.log('grbReviewer', grbReviewer);

  return (
    <div className={classNames('usa-summary-box', className)}>
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-05 line-height-body-1 text-normal text-body-xs">
        {t('reviewTask.title')}
      </h5>

      <h3 className="margin-top-0 margin-bottom-2">
        {t('reviewTask.voting.title')}
      </h3>

      <Trans
        t={t}
        i18nKey="reviewTask.voting.step1"
        components={{
          bold: <strong />
        }}
      />

      <CollapsableLink
        id="voting-step-1"
        label={t('reviewTask.voting.whatIsImportant')}
        className="margin-top-2"
      >
        <p className="margin-y-0">
          {t('reviewTask.voting.documentsOrResources')}
        </p>

        <ul className="padding-left-2 margin-top-1">
          {t<string[]>('prepare.possibleOutcomes.items', {
            returnObjects: true
          }).map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CollapsableLink>
    </div>
  );
};

export default GRBVotingPanel;
