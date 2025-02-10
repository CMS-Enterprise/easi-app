import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import CollapsableList from 'components/CollapsableList';

/** Summary box describing Business Case lifecycle cost categories */
const LifecycleCostSummary = () => {
  const { t } = useTranslation('businessCase');
  return (
    <SummaryBox>
      <SummaryBoxHeading headingLevel="h3">
        {t('businessCase:lifecycleCost.calloutHeading')}
      </SummaryBoxHeading>
      <SummaryBoxContent>
        <dl className="margin-bottom-105">
          <dt className="margin-bottom-1 text-bold">
            {t('businessCase:lifecycleCost.development')}
          </dt>
          <dd
            id="DevelopmentCostsDefinition"
            className="margin-bottom-2 margin-left-0 line-height-body-3"
          >
            {t('businessCase:lifecycleCost.developmentDef')}
          </dd>
          <dt className="margin-bottom-1 text-bold">
            {t('businessCase:lifecycleCost.operationsMaintenance')}
          </dt>
          <dd
            id="operationsMaintenanceCostsDefinition"
            className="margin-bottom-2 margin-left-0 line-height-body-3"
          >
            {t('businessCase:lifecycleCost.operationsMaintenanceDef')}
          </dd>
          <dt className="margin-bottom-1 text-bold">
            {t('businessCase:lifecycleCost.relatedCost')}
          </dt>
          <dd
            id="relatedCostDefinition"
            className="margin-left-0 line-height-body-3"
          >
            {t('businessCase:lifecycleCost.relatedCostDef')}
          </dd>
        </dl>

        <CollapsableList
          className="margin-top-2"
          label={t('lifecycleCost.availableRelatedCosts')}
          items={t('lifecycleCost.availableRelatedCostsDef', {
            returnObjects: true
          })}
        />
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default LifecycleCostSummary;
