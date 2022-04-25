import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, SummaryBox, TextInput } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray } from 'formik';
import { DateTime } from 'luxon';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { LifecycleCosts } from 'types/estimatedLifecycle';
import { getFiscalYear } from 'utils/date';
import formatDollars from 'utils/formatDollars';

import './index.scss';

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
          {t('businessCase:lifecycleCost.additionalCategory')}
        </dt>
        <dd
          id="AdditionalCategoryDefinition"
          className="margin-left-0 line-height-body-3"
        >
          {t('businessCase:lifecycleCost.additionalCategoryDef')}
        </dd>
      </dl>
    </SummaryBox>
  );
};

type PhaseProps = {
  category: 'development' | 'operationsMaintenance' | 'other';
  formikKey: string;
  fiscalYear: number;
  values: LifecycleCosts;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  years: {
    year1: LifecycleCosts;
    year2: LifecycleCosts;
    year3: LifecycleCosts;
    year4: LifecycleCosts;
    year5: LifecycleCosts;
  };
  total: number;
};

const Phase = ({
  category,
  formikKey,
  fiscalYear,
  values,
  setFieldValue,
  errors = {},
  years,
  total
}: PhaseProps) => {
  const { t } = useTranslation('businessCase');

  return (
    <FieldArray name={`${formikKey}.`}>
      {() => (
        <FieldGroup
          className="est-lifecycle-cost__phase-costs margin-0"
          error={Object.keys(errors).length > 0}
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
                  {t(`lifecycleCost.${category}`)}
                </legend>
                {Object.keys(years).map((year, i) => {
                  return (
                    <FieldGroup
                      key={year}
                      className="margin-0"
                      scrollElement={`${formikKey}.${year}.${category}.cost`}
                    >
                      <Label
                        className="tablet:display-none"
                        htmlFor={`BusinessCase-${formikKey}.${year}.${category}.cost`}
                        aria-label={`Enter year ${fiscalYear + i} ${t(
                          `lifecycleCost.${category}`
                        )} cost`}
                      >
                        {t('lifecycleCost.fiscalYear', { year })}
                      </Label>
                      <FieldErrorMsg>{errors?.development?.cost}</FieldErrorMsg>
                      <Field
                        as={TextInput}
                        className="desktop:margin-y-0"
                        error={!!errors?.development?.cost}
                        id={`BusinessCase-${formikKey}.${year}.${category}.cost`}
                        name={`${formikKey}.${year}.${category}.cost`}
                        maxLength={10}
                        match={/^[0-9\b]+$/}
                        aria-describedby={`${category}CostsDefinition`}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(
                            `${formikKey}.${year}.${category}.cost`,
                            e.target.value
                          );
                          setFieldValue(
                            `${formikKey}.${year}.${category}.isPresent`,
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

const OtherCosts = () => {
  const [active, setActive] = useState(false);
  const { t } = useTranslation('businessCase');
  const options = t('lifecycleCost.categories', { returnObjects: true });
  return (
    <div>
      {!active && (
        <button type="button" onClick={() => setActive(true)}>
          Add new cost category
        </button>
      )}
      {active && (
        <form>
          <label htmlFor="newCostCategorySelect">
            What is your new cost category?
          </label>
          <select id="newCostCategorySelect">
            <option>-Select-</option>
            {Object.keys(options).map(key => {
              return <option>{options[key]}</option>;
            })}
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setActive(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

type EstimatedLifecycleCostProps = {
  formikKey: string;
  years: {
    year1: LifecycleCosts;
    year2: LifecycleCosts;
    year3: LifecycleCosts;
    year4: LifecycleCosts;
    year5: LifecycleCosts;
  };
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  businessCaseCreatedAt?: string;
};
const EstimatedLifecycleCost = ({
  formikKey,
  years,
  setFieldValue,
  errors = {},
  businessCaseCreatedAt = ''
}: EstimatedLifecycleCostProps) => {
  const sumCostinYear = (phases: LifecycleCosts) => {
    const { development, operationsMaintenance, other } = phases;
    return (
      (development.isPresent ? parseFloat(development.cost || '0') : 0) +
      (operationsMaintenance.isPresent
        ? parseFloat(operationsMaintenance.cost || '0')
        : 0) +
      (other.isPresent ? parseFloat(other.cost || '0') : 0)
    );
  };
  const year1Cost = sumCostinYear(years.year1);
  const year2Cost = sumCostinYear(years.year2);
  const year3Cost = sumCostinYear(years.year3);
  const year4Cost = sumCostinYear(years.year4);
  const year5Cost = sumCostinYear(years.year5);

  const calculateCategoryCost = (
    category: 'development' | 'operationsMaintenance' | 'other'
  ) => {
    return Object.keys(years).reduce((total, year) => {
      return total + parseFloat(years[year][category].cost || 0);
    }, 0);
  };

  const fiscalYear = getFiscalYear(DateTime.fromISO(businessCaseCreatedAt));

  return (
    <div className="est-lifecycle-cost">
      <CostSummary />

      <div className="cost-table margin-y-4">
        <div className="cost-table-row cost-table-row__headings grid-row">
          {Object.keys(years).map((year, i) => {
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
          values={years.year1}
          setFieldValue={setFieldValue}
          errors={errors.year1}
          years={years}
          total={calculateCategoryCost('development')}
        />
        <Phase
          category="operationsMaintenance"
          formikKey={formikKey}
          fiscalYear={fiscalYear}
          values={years.year1}
          setFieldValue={setFieldValue}
          errors={errors.year1}
          years={years}
          total={calculateCategoryCost('operationsMaintenance')}
        />
        <OtherCosts />
        <div className="est-lifecycle-cost__total bg-base-lightest overflow-auto margin-top-3 padding-x-2">
          <DescriptionList title="System total cost">
            <DescriptionTerm term="System total cost" />
            <DescriptionDefinition
              definition={formatDollars(
                year1Cost + year2Cost + year3Cost + year4Cost + year5Cost
              )}
            />
          </DescriptionList>
        </div>
      </div>
    </div>
  );
};

export default EstimatedLifecycleCost;
