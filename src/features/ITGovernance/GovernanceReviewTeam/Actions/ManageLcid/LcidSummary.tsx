import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import LcidStatusTag from 'components/LcidStatusTag';
import { RichTextViewer } from 'components/RichTextEditor';
import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

export type LcidSummaryProps = {
  lcid: string | null;
  lcidIssuedAt: string | null;
  lcidExpiresAt: string | null;
  lcidRetiresAt: string | null;
  lcidScope: string | null;
  decisionNextSteps: string | null;
  lcidCostBaseline: string | null;
  lcidStatus: SystemIntakeLCIDStatus | null;
};

const LcidSummary = ({
  lcidStatus,
  lcid,
  lcidIssuedAt,
  lcidExpiresAt,
  lcidRetiresAt,
  lcidScope,
  decisionNextSteps,
  lcidCostBaseline,
  className
}: LcidSummaryProps & { className?: string }) => {
  const { t } = useTranslation('action');

  return (
    <div
      className={classNames(
        'lcid-summary-box padding-3 bg-base-lightest',
        className
      )}
    >
      <Grid row gap className="lcid-summary-box--heading flex-align-center">
        <h3 className="margin-0">{t('updateLcid.currentLcid')}</h3>
        {lcidStatus && (
          <div>
            <LcidStatusTag
              lcidStatus={lcidStatus}
              lcidExpiresAt={lcidExpiresAt}
              lcidRetiresAt={lcidRetiresAt}
            />
          </div>
        )}
      </Grid>

      <dl className="margin-bottom-0">
        <dt className="text-bold margin-top-3">
          {t('updateLcid.currentLcid')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {lcid}
        </dd>

        <Grid row>
          <Grid col={4}>
            <dt className="text-bold margin-top-2">
              {t('updateLcid.issueDate')}
            </dt>
            <dd className="margin-left-0 font-body-md line-height-body-5">
              {formatDateLocal(lcidIssuedAt || '', 'MM/dd/yyyy')}
            </dd>
          </Grid>

          <Grid>
            <dt className="text-bold margin-top-2">
              {t('updateLcid.currentExpirationDate')}
            </dt>
            <dd className="margin-left-0 font-body-md line-height-body-5">
              {formatDateLocal(lcidExpiresAt || '', 'MM/dd/yyyy')}
            </dd>
          </Grid>
        </Grid>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentScope')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          <RichTextViewer
            value={
              lcidScope || t('governanceReviewTeam:notes.extendLcid.noScope')
            }
          />
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentNextSteps')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          <RichTextViewer
            value={
              decisionNextSteps ||
              t('governanceReviewTeam:notes.extendLcid.noNextSteps')
            }
          />
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentCostBaseline')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          <RichTextViewer
            value={
              lcidCostBaseline ||
              t('governanceReviewTeam:notes.extendLcid.noCostBaseline')
            }
          />
        </dd>
      </dl>
    </div>
  );
};

export default LcidSummary;
