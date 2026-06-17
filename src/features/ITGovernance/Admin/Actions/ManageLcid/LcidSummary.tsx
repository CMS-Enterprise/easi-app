import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeContactComponent,
  SystemIntakeLCIDStatus,
  SystemIntakeLCIDType
} from 'gql/generated/graphql';

import LcidStatusTag from 'components/LcidStatusTag';
import { RichTextViewer } from 'components/RichTextEditor';
import { getComponentByEnum } from 'constants/cmsComponentsMap';
import { formatDateLocal } from 'utils/date';

export type LcidSummaryProps = {
  lcid: string | null | undefined;
  lcidDisplay?: string | null | undefined;
  lcidIssuedAt?: string | null | undefined;
  lcidExpiresAt?: string | null | undefined;
  lcidRetiresAt?: string | null | undefined;
  lcidScope?: string | null | undefined;
  decisionNextSteps?: string | null | undefined;
  lcidCostBaseline?: string | null | undefined;
  lcidType?: SystemIntakeLCIDType | null | undefined;
  lcidComponent?: SystemIntakeContactComponent | null | undefined;
  lcidIsLowIt?: boolean | null | undefined;
  lcidIsShortened?: boolean | null | undefined;
  lcidStatus?: SystemIntakeLCIDStatus | null | undefined;
};

const LcidSummary = ({
  lcidStatus,
  lcid,
  lcidDisplay,
  lcidIssuedAt,
  lcidExpiresAt,
  lcidRetiresAt,
  lcidScope,
  decisionNextSteps,
  lcidCostBaseline,
  lcidType,
  lcidComponent,
  lcidIsLowIt,
  lcidIsShortened,
  className
}: LcidSummaryProps & { className?: string }) => {
  const { t } = useTranslation('action');

  let lcidIsShortenedLabel = t('governanceReviewTeam:notes.extendLcid.noScope');
  if (lcidIsShortened === true) {
    lcidIsShortenedLabel = t('issueLCID.lcidIsShortened.yes');
  } else if (lcidIsShortened === false) {
    lcidIsShortenedLabel = t('issueLCID.lcidIsShortened.no');
  }

  let lcidIsLowItLabel = t('governanceReviewTeam:notes.extendLcid.noScope');
  if (lcidIsLowIt === true) {
    lcidIsLowItLabel = t('issueLCID.lcidIsLowIt.yes');
  } else if (lcidIsLowIt === false) {
    lcidIsLowItLabel = t('issueLCID.lcidIsLowIt.no');
  }

  const lcidComponentLabel = lcidComponent
    ? t(getComponentByEnum(lcidComponent).labelKey)
    : t('governanceReviewTeam:notes.extendLcid.noScope');

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
          {lcidDisplay ?? lcid}
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

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentLcidType')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {lcidType
            ? t(`issueLCID.lcidType.${lcidType}`)
            : t('governanceReviewTeam:notes.extendLcid.noScope')}
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentLcidComponent')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {lcidComponentLabel}
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentLcidIsShortened')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {lcidIsShortenedLabel}
        </dd>

        <dt className="text-bold margin-top-2">
          {t('updateLcid.currentLcidIsLowIt')}
        </dt>
        <dd className="margin-left-0 font-body-md line-height-body-5">
          {lcidIsLowItLabel}
        </dd>
      </dl>
    </div>
  );
};

export default LcidSummary;
