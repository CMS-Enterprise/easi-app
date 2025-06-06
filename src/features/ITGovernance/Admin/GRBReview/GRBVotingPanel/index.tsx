import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import classNames from 'classnames';
import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';
import UswdsReactLink from 'components/LinkWrapper';

import GRBVoteStatus from './GRBVoteStatus';
import GRBVotingModal from './GRBVotingModal';

export type GRBVotingPanelProps = {
  grbReviewer: SystemIntakeGRBReviewerFragment;
  className?: string;
};

const GRBVotingPanel = ({ grbReviewer, className }: GRBVotingPanelProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  return (
    <div className={classNames('usa-summary-box easi-body-normal', className)}>
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-105 line-height-body-1 text-normal text-body-xs">
        {t('reviewTask.title')}
      </h5>

      <h3 className="margin-top-0 margin-bottom-2">
        {t('reviewTask.voting.title')}
      </h3>

      {/* Step 1 */}
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
          innerClassName="padding-bottom-2px"
          bold
        >
          <p className="margin-y-0">
            {t('reviewTask.voting.documentsOrResources')}
          </p>

          <ul className="padding-left-2 margin-top-1 margin-bottom-0 smaller-bullet-list">
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

      <div className="border-bottom-1px border-info-light margin-y-3" />

      {/* Step 2 */}
      <Trans
        t={t}
        i18nKey="reviewTask.voting.step2"
        components={{
          bold: <strong />
        }}
      />

      <div className="margin-left-105">
        <CollapsableLink
          id="voting-step-1"
          label={t('reviewTask.voting.howShouldIParticipate')}
          className="margin-top-2"
          innerClassName="padding-bottom-2px"
          bold
        >
          <ul className="padding-left-2 margin-top-0 margin-bottom-0 smaller-bullet-list">
            {t<string[]>('reviewTask.voting.discussionItems', {
              returnObjects: true
            })?.map((item, index) => (
              <li key={item}>
                <Trans
                  t={t}
                  i18nKey={`reviewTask.voting.discussionItems.${index}`}
                  components={{
                    discussionLink: (
                      <NavHashLink
                        to={`/it-governance/${systemId}/grb-review#discussions`}
                        className="display-block"
                        style={{ paddingLeft: '20px' }}
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

      <div className="border-bottom-1px border-info-light margin-y-3" />

      {/* Step 3 */}
      <Trans
        t={t}
        i18nKey="reviewTask.voting.step3"
        components={{
          bold: <strong />
        }}
      />

      <div className="margin-bottom-1">
        <p className="margin-y-0">{t('reviewTask.voting.step3Description')}</p>
      </div>

      {!!grbReviewer?.vote && grbReviewer.dateVoted && (
        <GRBVoteStatus
          vote={grbReviewer.vote}
          dateVoted={grbReviewer.dateVoted}
          className="margin-bottom-105 "
        />
      )}

      <GRBVotingModal grbReviewer={grbReviewer} />
    </div>
  );
};

export default GRBVotingPanel;
