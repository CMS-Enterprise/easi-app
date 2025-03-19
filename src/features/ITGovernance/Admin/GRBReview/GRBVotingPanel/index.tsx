import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import classNames from 'classnames';
import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';
import UswdsReactLink from 'components/LinkWrapper';

export type GRBVotingPanelProps = {
  grbReviewer: SystemIntakeGRBReviewerFragment;
  className?: string;
};

const GRBVotingPanel = ({ grbReviewer, className }: GRBVotingPanelProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  console.log('grbReviewer', grbReviewer);

  return (
    <div className={classNames('usa-summary-box', className)}>
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-1 line-height-body-1 text-normal text-body-xs">
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

      <div className="margin-left-105">
        <CollapsableLink
          id="voting-step-1"
          label={t('reviewTask.voting.whatIsImportant')}
          className="margin-top-2"
        >
          <p className="margin-y-0">
            {t('reviewTask.voting.documentsOrResources')}
          </p>

          <ul className="padding-left-2 margin-top-1 smaller-bullet-list">
            {t<string[]>('reviewTask.voting.documentItems', {
              returnObjects: true
            })?.map((item, index) => (
              <li key={item}>
                <Trans
                  t={t}
                  i18nKey={`reviewTask.voting.documentItems.${index}`}
                  components={{
                    presentationLink: (
                      <NavHashLink
                        to={`/it-governance/${systemId}/grb-review#documents`}
                      >
                        {' '}
                      </NavHashLink>
                    ),
                    businessCaseLink: (
                      <UswdsReactLink to="./business-case"> </UswdsReactLink>
                    ),
                    grtLink: (
                      <NavHashLink
                        to={`/it-governance/${systemId}/grb-review#details`}
                      >
                        {' '}
                      </NavHashLink>
                    )
                  }}
                />
              </li>
            ))}
          </ul>
        </CollapsableLink>
      </div>
    </div>
  );
};

export default GRBVotingPanel;
