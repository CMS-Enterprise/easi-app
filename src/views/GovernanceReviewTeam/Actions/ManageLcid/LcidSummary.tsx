import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

type LcidSummaryProps = {
  lcid: string | null;
  lcidStatus: SystemIntakeLCIDStatus | null;
  lcidExpiresAt: string | null;
  lcidScope: string | null;
  decisionNextSteps: string | null;
  lcidCostBaseline: string | null;
  className?: string;
};

const LcidSummary = ({
  lcidStatus,
  lcid,
  lcidExpiresAt,
  lcidScope,
  decisionNextSteps,
  lcidCostBaseline,
  className
}: LcidSummaryProps) => {
  const { t } = useTranslation('action');

  return (
    <div className={classNames('padding-3 bg-base-lightest', className)}>
      <h3 className="margin-0">{t('updateLcid.currentLcid')}</h3>

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
            {/* TODO: Update issue date when added to schema */}
            <dd className="margin-left-0 font-body-md line-height-body-5">
              {formatDateLocal(lcidExpiresAt || '', 'MM/dd/yyyy')}
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
          {lcidScope}
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentNextSteps')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {decisionNextSteps}
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentCostBaseline')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {lcidCostBaseline}
        </dd>
      </dl>
    </div>
  );
};

export default LcidSummary;
