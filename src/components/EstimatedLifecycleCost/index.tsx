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
          // error={Object.keys(errors).length > 0}
          // scrollElement={`${formikKey}.year${year}`}
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
                  return (
                    <FieldGroup
                      key={`${category}-${year}`}
                      className="margin-0"
                      scrollElement={`${formikKey}.${category}.years.${year}`}
                    >
                      <Label
                        className="tablet:display-none"
                        htmlFor={`BusinessCase-${formikKey}.${category}.years.${year}`}
                        aria-label={`Enter year ${fiscalYear + i} ${t(
                          `lifecycleCost.${category}`
                        )} cost`}
                      >
                        {t('lifecycleCost.fiscalYear', { year })}
                      </Label>
                      <FieldErrorMsg>{errors?.development?.cost}</FieldErrorMsg>
                      <Field
                        type="text"
                        className="desktop:margin-y-0 usa-input"
                        // error={!!errors?.development?.cost}
                        id={`BusinessCase-${formikKey}.${category}.years.${year}`}
                        name={`${formikKey}.${category}.years.${year}`}
                        maxLength={10}
                        aria-describedby={`${category}CostsDefinition`}
                        // value={
                        //   lifecycleCosts[category].years[year as keyof LifecycleYears]
                        // }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(
                            `${formikKey}.${category}.years.${year}`,
                            e.target.value
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
                <div>
                  <span className="cost-table-col">{formatDollars(total)}</span>
                </div>
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
  lifecycleCosts
}: {
  formikKey: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  lifecycleCosts: LifecycleCosts;
}) => {
  const [active, setActive] = useState(false);
  const [relatedCost, setRelatedCost] = useState('');
  const { t } = useTranslation('businessCase');
  const relatedCosts = t('lifecycleCost.relatedCostOptions', {
    returnObjects: true
  });
  return (
    <div className="cost-table-row cost-table-row__other">
      {!active && (
        <Button
          type="button"
          unstyled
          onClick={() => setActive(true)}
          className="display-flex flex-align-center"
        >
          <IconAdd className="margin-right-1" />
          {t('lifecycleCost.addRelatedCost')}
        </Button>
      )}
      {active && (
        <div className="display-flex flex-align-center">
          <Label htmlFor="newRelatedCostSelect">
            {t('lifecycleCost.newRelatedCost')}
          </Label>
          <select
            className="margin-top-0 desktop:margin-x-2 usa-select"
            id="newRelatedCostSelect"
            onBlur={e => setRelatedCost(e.target.value)}
          >
            <option>-{t('Select')}-</option>
            {Object.keys(relatedCosts).map(key => {
              return (
                <option key={key} value={key}>
                  {relatedCosts[key]}
                </option>
              );
            })}
          </select>
          <Button
            type="submit"
            onClick={() => {
              Object.keys(lifecycleCosts).forEach(cost => {
                setFieldValue(
                  `${formikKey}.${cost}.${relatedCost}.isPresent`,
                  true
                );
                setRelatedCost('');
                setActive(false);
              });
            }}
          >
            {t('save')}
          </Button>
          <Button type="button" outline onClick={() => setActive(false)}>
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
  const { t } = useTranslation('businessCase');
  const sumCostinYear = (year: keyof LifecycleYears) => {
    return Object.values(lifecycleCosts).reduce((total, cost) => {
      return total + (cost.years[year] ? parseFloat(cost.years[year]) : 0);
    }, 0);
  };
  const calculateCategoryCost = (category: categoryKeys) => {
    return Object.values(lifecycleCosts[category].years).reduce(
      (total, cost) => {
        return total + (cost ? parseFloat(cost) : 0);
      },
      0
    );
  };

  // console.log(lifecycleCosts);

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
          // errors={errors.year1}
          lifecycleCosts={lifecycleCosts}
          total={calculateCategoryCost('development')}
        />
        <Phase
          category="operationsMaintenance"
          formikKey={formikKey}
          fiscalYear={fiscalYear}
          setFieldValue={setFieldValue}
          // errors={errors.year1}
          lifecycleCosts={lifecycleCosts}
          total={calculateCategoryCost('operationsMaintenance')}
        />
        {Object.keys(lifecycleCosts)
          .filter(cost => lifecycleCosts[cost].type === 'related')
          .map(cost => {
            if (!lifecycleCosts[cost].isPresent) return null;
            return (
              <Phase
                key={cost}
                category={cost}
                formikKey={formikKey}
                fiscalYear={fiscalYear}
                setFieldValue={setFieldValue}
                // errors={errors.year1}
                lifecycleCosts={lifecycleCosts}
                total={calculateCategoryCost(cost)}
              />
            );
          })}
        {/* <OtherCosts
          formikKey={formikKey}
          setFieldValue={setFieldValue}
          lifecycleCosts={lifecycleCosts}
        /> */}
        {/* <div className="cost-table-row cost-table-row__totals border-bottom-0">
          {Object.keys(lifecycleCosts).map(key => {
            return (
              <span key={key}>{formatDollars(sumCostinYear(lifecycleCosts[key]))}</span>
            );
          })}
        </div> */}
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
