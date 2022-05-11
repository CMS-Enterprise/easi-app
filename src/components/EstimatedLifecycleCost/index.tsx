import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAdd, Label, SummaryBox } from '@trussworks/react-uswds';
import { Field, FieldArray } from 'formik';
import { DateTime } from 'luxon';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { LifecycleCosts, LifecycleYears } from 'types/estimatedLifecycle';
import { getFiscalYear } from 'utils/date';
import formatDollars from 'utils/formatDollars';

import './index.scss';

type categoryKeys =
  | 'development'
  | 'operationsMaintenance'
  | 'helpDesk'
  | 'software'
  | 'planning'
  | 'infrastructure'
  | 'oit'
  | 'other';

const CostSummary = () => {
  const { t } = useTranslation('businessCase');
  return (
    <SummaryBox heading={t('businessCase:lifecycleCost.calloutHeading')}>
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
    </SummaryBox>
  );
};

type PhaseProps = {
  category: categoryKeys;
  formikKey: string;
  fiscalYear: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  lifecycleCosts: LifecycleCosts;
  total: number;
};

const Phase = ({
  category,
  formikKey,
  fiscalYear,
  setFieldValue,
  errors = {},
  lifecycleCosts,
  total
}: PhaseProps) => {
  const { t } = useTranslation('businessCase');

  return (
    <FieldArray name={`${formikKey}.`}>
      {() => (
        <FieldGroup
          className="est-lifecycle-cost__phase-costs margin-0"
          error={Object.keys(errors).length > 0}
          scrollElement={`${formikKey}.${category}`}
        >
          <div className="est-lifecycle-cost__phase-fieldset">
            <fieldset
              className="usa-fieldset"
              aria-describedby="BusinessCase-EstimatedLifecycleCostHelp"
            >
              <FieldErrorMsg>
                {typeof errors === 'string' ? errors : ''}
              </FieldErrorMsg>
              <div className="cost-table-row">
                <legend className="cost-table-col usa-label">
                  {t(lifecycleCosts[category].label)}
                </legend>
                {Object.keys(lifecycleCosts[category].years).map((year, i) => {
                  const currentYear = fiscalYear + i;
                  return (
                    <FieldGroup
                      key={`${category}-${year}`}
                      className="margin-0"
                      scrollElement={`${formikKey}.${category}.years.${year}`}
                    >
                      <Label
                        className="desktop:display-none maxw-none"
                        htmlFor={`BusinessCase-${formikKey}.${category}.years.${year}`}
                        aria-label={`Enter year ${currentYear} ${t(
                          `lifecycleCost.${category}`
                        )} cost`}
                      >
                        {t('lifecycleCost.fiscalYear', { currentYear })}
                      </Label>
                      <FieldErrorMsg>{errors?.development?.cost}</FieldErrorMsg>
                      <Field
                        type="text"
                        className="desktop:margin-y-0 maxw-none usa-input"
                        error={errors?.development?.years?.year}
                        id={`BusinessCase-${formikKey}.${category}.years.${year}`}
                        name={`${formikKey}.${category}.years.${year}`}
                        maxLength={10}
                        aria-describedby={`${category}CostsDefinition`}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(
                            `${formikKey}.${category}.years.${year}`,
                            e.target.value.replace(/\D/g, '')
                          );
                          setFieldValue(
                            `${formikKey}.${category}.isPresent`,
                            true
                          );
                        }}
                      />
                    </FieldGroup>
                  );
                })}
                <span className="cost-table-col display-none desktop:display-block">
                  {formatDollars(total)}
                </span>
              </div>
            </fieldset>
          </div>
        </FieldGroup>
      )}
    </FieldArray>
  );
};

const OtherCosts = ({
  formikKey,
  setFieldValue,
  lifecycleCosts,
  relatedCosts,
  setRelatedCosts
}: {
  formikKey: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  lifecycleCosts: LifecycleCosts;
  relatedCosts: any;
  setRelatedCosts: (relatedCost: any) => void;
}) => {
  const [activeRelatedCost, setActiveRelatedCost] = useState<any>(null);
  const { t } = useTranslation('businessCase');

  if (Object.keys(relatedCosts).length > 2) return null;
  return (
    <div className="cost-table-row cost-table-row__other">
      {!activeRelatedCost && (
        <Button
          type="button"
          unstyled
          onClick={() => setActiveRelatedCost(true)}
          className="display-flex flex-align-center"
        >
          <IconAdd className="margin-right-1" />
          {t('lifecycleCost.addRelatedCost')}
        </Button>
      )}
      {activeRelatedCost && (
        <div className="desktop:display-flex flex-align-center">
          <Label htmlFor="newRelatedCostSelect">
            {t('lifecycleCost.newRelatedCost')}
          </Label>
          <select
            className="margin-y-2 desktop:margin-y-0 desktop:margin-x-2 usa-select"
            id="newRelatedCostSelect"
            onBlur={e => setActiveRelatedCost(e.target.value)}
          >
            <option>-{t('Select')}-</option>
            {Object.keys(lifecycleCosts)
              .filter(cost => {
                return (
                  lifecycleCosts[cost as keyof LifecycleCosts].type ===
                    'related' && !relatedCosts[cost]
                );
              })
              .map(cost => {
                return (
                  <option key={cost} value={cost}>
                    {lifecycleCosts[cost as keyof LifecycleCosts].label}
                  </option>
                );
              })}
          </select>
          <Button
            className="width-auto"
            type="submit"
            onClick={() => {
              if (lifecycleCosts[activeRelatedCost as keyof LifecycleCosts]) {
                setRelatedCosts({
                  ...relatedCosts,
                  [activeRelatedCost]:
                    lifecycleCosts[activeRelatedCost as keyof LifecycleCosts]
                });
              }
              setActiveRelatedCost(null);
            }}
          >
            {t('save')}
          </Button>
          <Button
            className="width-auto"
            type="button"
            outline
            onClick={() => setActiveRelatedCost(null)}
          >
            {t('cancel')}
          </Button>
        </div>
      )}
    </div>
  );
};

type EstimatedLifecycleCostProps = {
  formikKey: string;
  lifecycleCosts: LifecycleCosts;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  businessCaseCreatedAt?: string;
};
const EstimatedLifecycleCost = ({
  formikKey,
  lifecycleCosts,
  setFieldValue,
  errors = {},
  businessCaseCreatedAt = ''
}: EstimatedLifecycleCostProps) => {
  const [relatedCosts, setRelatedCosts] = useState({});
  const sumCostinYear = (year: string) => {
    return Object.values(lifecycleCosts).reduce((total, current) => {
      const cost = current.years[year as keyof LifecycleYears];
      return total + (cost ? parseFloat(cost) : 0);
    }, 0);
  };
  const calculateCategoryCost = (category: categoryKeys) => {
    return Object.values(lifecycleCosts[category].years).reduce(
      (total, current) => {
        return total + (current ? parseFloat(current) : 0);
      },
      0
    );
  };

  const fiscalYear = getFiscalYear(DateTime.fromISO(businessCaseCreatedAt));

  return (
    <div className="est-lifecycle-cost">
      <CostSummary />

      <div className="cost-table margin-y-4">
        <div className="cost-table-row cost-table-row__headings minh-0">
          {Object.keys(lifecycleCosts.development.years).map((year, i) => {
            return (
              <h4 key={year} className="cost-table-col margin-0">
                FY {fiscalYear + i}
              </h4>
            );
          })}
          <h4 className="cost-table-col margin-0">Total</h4>
        </div>
        <Phase
          category="development"
          formikKey={formikKey}
          fiscalYear={fiscalYear}
          setFieldValue={setFieldValue}
          errors={errors}
          lifecycleCosts={lifecycleCosts}
          total={calculateCategoryCost('development')}
        />
        <Phase
          category="operationsMaintenance"
          formikKey={formikKey}
          fiscalYear={fiscalYear}
          setFieldValue={setFieldValue}
          errors={errors}
          lifecycleCosts={lifecycleCosts}
          total={calculateCategoryCost('operationsMaintenance')}
        />
        {Object.keys(relatedCosts).map((cost: any) => {
          return (
            <Phase
              key={cost}
              category={cost}
              formikKey={formikKey}
              fiscalYear={fiscalYear}
              setFieldValue={setFieldValue}
              errors={errors}
              lifecycleCosts={lifecycleCosts}
              total={calculateCategoryCost(cost)}
            />
          );
        })}
        <OtherCosts
          formikKey={formikKey}
          setFieldValue={setFieldValue}
          lifecycleCosts={lifecycleCosts}
          relatedCosts={relatedCosts}
          setRelatedCosts={setRelatedCosts}
        />
        <div className="cost-table-row cost-table-row__totals border-bottom-0">
          {Object.keys(lifecycleCosts.development.years).map(year => {
            return <span key={year}>{formatDollars(sumCostinYear(year))}</span>;
          })}
        </div>
        <div className="est-lifecycle-cost__total bg-base-lightest overflow-auto margin-top-3 padding-x-2">
          <DescriptionList title="System total cost">
            <DescriptionTerm term="System total cost" />
            <DescriptionDefinition
              definition={formatDollars(
                sumCostinYear('year1') +
                  sumCostinYear('year2') +
                  sumCostinYear('year3') +
                  sumCostinYear('year4') +
                  sumCostinYear('year5')
              )}
            />
          </DescriptionList>
        </div>
      </div>
    </div>
  );
};

export default EstimatedLifecycleCost;
