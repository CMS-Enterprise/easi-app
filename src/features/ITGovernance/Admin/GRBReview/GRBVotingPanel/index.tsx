import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { Button, ButtonGroup } from '@trussworks/react-uswds';
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
          label={t('reviewTask.voting.whatIsImportant')}
          className="margin-top-2"
          innerClassName="padding-bottom-2px"
          bold
        >
          <p className="margin-y-0">
            {t('reviewTask.voting.howShouldIParticipate')}
          </p>

          <ul className="padding-left-2 margin-top-1 margin-bottom-0 smaller-bullet-list">
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
                        style={{ marginLeft: '20px' }}
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

      <p className="margin-y-0">{t('reviewTask.voting.step3Description')}</p>

      <div className="border-bottom-1px border-info-light margin-y-3" />

      <ButtonGroup>
        <Button type="button" onClick={() => null}>
          {t('reviewTask.voting.noObjection')}
        </Button>

        <Button type="button" onClick={() => null} secondary>
          {t('reviewTask.voting.object')}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default GRBVotingPanel;
