import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  IconAdd,
  Label,
  Link as UswdsLink,
  SummaryBox
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray } from 'formik';

import CollapsableList from 'components/CollapsableList';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import { LifecycleCosts, LifecycleYears } from 'types/estimatedLifecycle';
import { getFiscalYear, parseAsUTC } from 'utils/date';
import formatDollars from 'utils/formatDollars';

import './index.scss';

type CategoryKeys =
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
      <CollapsableList
        className="margin-top-2"
        label={t('lifecycleCost.availableRelatedCosts')}
        items={t('lifecycleCost.availableRelatedCostsDef', {
          returnObjects: true
        })}
      />
    </SummaryBox>
  );
};

type PhaseProps = {
  category: CategoryKeys;
  formikKey: string;
  fiscalYear: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  lifecycleCosts: LifecycleCosts;
  removeCategory: (category: CategoryKeys) => void;
  total: number;
};

const Phase = ({
  category,
  formikKey,
  fiscalYear,
  setFieldValue,
  lifecycleCosts,
  removeCategory,
  total
}: PhaseProps) => {
  const { t } = useTranslation('businessCase');

  return (
    <FieldArray name={`${formikKey}.${category}`}>
      {() => (
        <FieldGroup className="est-lifecycle-cost__phase-costs margin-0">
          <div className="est-lifecycle-cost__phase-fieldset">
            <fieldset
              className="usa-fieldset"
              aria-describedby="BusinessCase-EstimatedLifecycleCostHelp"
            >
              <div className="cost-table-row">
                <div className="cost-table-col">
                  <legend className="usa-label">
                    {t(lifecycleCosts[category].label)}
                  </legend>
                  {lifecycleCosts[category].type === 'related' && (
                    <Button
                      unstyled
                      type="button"
                      className="text-error"
                      onClick={() => removeCategory(category)}
                    >
                      {t('lifecycleCost.removeCategory')}
                    </Button>
                  )}
                </div>
                {Object.keys(lifecycleCosts[category].years).map((year, i) => {
                  const currentYear = fiscalYear + i;
                  return (
                    <FieldGroup
                      key={`${category}-${year}`}
                      className="margin-0"
                    >
                      <Label
                        className="desktop:display-none maxw-none"
                        htmlFor={`BusinessCase-${formikKey}.${category}.years.${year}`}
                        aria-label={`Enter year ${currentYear} ${t(
                          `lifecycleCost.${category}`
                        )} cost`}
                      >
                        {t('lifecycleCost.fiscalYear', { year: currentYear })}
                      </Label>
                      <Field
                        type="text"
                        className="desktop:margin-y-0 maxw-none usa-input"
                        id={`BusinessCase-${formikKey}.${category}.years.${year}`}
                        name={`${formikKey}.${category}.years.${year}`}
                        maxLength={10}
                        aria-describedby={`${category}CostsDefinition`}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(
                            `${formikKey}.${category}.years.${year}`,
                            e.target.value.replace(/\D/g, '')
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
  lifecycleCosts,
  relatedCosts,
  setRelatedCosts
}: {
  lifecycleCosts: LifecycleCosts;
  relatedCosts: any;
  setRelatedCosts: (relatedCost: any) => void;
}) => {
  const [activeRelatedCost, setActiveRelatedCost] = useState<any>(null);
  const { t } = useTranslation('businessCase');

  if (relatedCosts.length > 2) return null;
  return (
    <div className="cost-table-row cost-table-row__other">
      {activeRelatedCost === null && (
        <Button
          type="button"
          unstyled
          onClick={() => setActiveRelatedCost('')}
          className="display-flex flex-align-center"
        >
          <IconAdd className="margin-right-1" />
          {t('lifecycleCost.addRelatedCost')}
        </Button>
      )}
      {activeRelatedCost !== null && (
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
                  lifecycleCosts[cost as CategoryKeys].type === 'related' &&
                  !relatedCosts.includes(cost)
                );
              })
              .map(cost => {
                return (
                  <option key={cost} value={cost}>
                    {lifecycleCosts[cost as CategoryKeys].label}
                  </option>
                );
              })}
          </select>
          <Button
            className="width-auto"
            type="submit"
            onClick={() => {
              if (lifecycleCosts[activeRelatedCost as CategoryKeys]) {
                setRelatedCosts(activeRelatedCost);
              }
              setActiveRelatedCost(null);
            }}
          >
            {t('Save')}
          </Button>
          <Button
            className="width-auto"
            type="button"
            outline
            onClick={() => setActiveRelatedCost(null)}
          >
            {t('Cancel')}
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
  className: string;
};
const EstimatedLifecycleCost = ({
  formikKey,
  lifecycleCosts,
  setFieldValue,
  errors = {},
  businessCaseCreatedAt = '',
  className
}: EstimatedLifecycleCostProps) => {
  const [relatedCosts, setRelatedCosts] = useState([
    ...Object.keys(lifecycleCosts).filter(cost => {
      const { type, isPresent } = lifecycleCosts[cost as CategoryKeys];
      return isPresent && type === 'related';
    })
  ]);
  const sumCostinYear = (year: string) => {
    return Object.values(lifecycleCosts).reduce((total, current) => {
      const cost = current.years[year as keyof LifecycleYears];
      return total + (cost ? parseFloat(cost) : 0);
    }, 0);
  };
  const calculateCategoryCost = (category: CategoryKeys) => {
    return Object.values(lifecycleCosts[category].years).reduce(
      (total, current) => {
        return total + (current ? parseFloat(current) : 0);
      },
      0
    );
  };
  const removeCategory = (category: CategoryKeys) => {
    setRelatedCosts(relatedCosts.filter(cost => cost !== category));
    if (lifecycleCosts[category].isPresent) {
      setFieldValue(`${formikKey}.${category}.isPresent`, false);
      Object.keys(lifecycleCosts[category].years).forEach(year => {
        setFieldValue(`${formikKey}.${category}.years.${year}`, '');
      });
    }
  };

  /** Add related cost to table */
  const addRelatedCost = (category: CategoryKeys) => {
    setRelatedCosts([...relatedCosts, category]);
    setFieldValue(`${formikKey}.${category}.isPresent`, true);
  };

  const { t } = useTranslation('businessCase');
  const fiscalYear = businessCaseCreatedAt
    ? getFiscalYear(parseAsUTC(businessCaseCreatedAt))
    : new Date().getFullYear();

  return (
    <div className={classNames('est-lifecycle-cost', className)}>
      <h2 className="margin-0">{t('lifecycleCost.heading')}</h2>
      <HelpText
        className="margin-bottom-2"
        id="BusinessCase-EstimatedLifecycleCostHelp"
      >
        <p className="margin-y-2">{t('lifecycleCost.intro')}</p>
        <Trans i18nKey="businessCase:lifecycleCost.considerations">
          indexOne
          <ul className="padding-left-3 margin-top-1">
            <li>indexTwo</li>
            <li>indexTwo</li>
            <li>indexTwo</li>
            <li>indexTwo</li>
          </ul>
        </Trans>
        <Trans i18nKey="businessCase:lifecycleCost.questions">
          indexOne
          <UswdsLink href="mailto:IT_Governance@cms.hhs.gov">
            indexTwo
          </UswdsLink>
          indexThree
        </Trans>
      </HelpText>
      <CostSummary />

      <div className="cost-table margin-y-4">
        <FieldGroup
          error={Object.keys(errors).length > 0}
          scrollElement={formikKey}
        >
          <h4 className="margin-0">{t('lifecycleCost.tableHeading')}</h4>
          <p className="margin-top-1 text-base">
            {t('lifecycleCost.tableDescription')}
          </p>
          <FieldErrorMsg>
            {typeof errors === 'string' ? errors : ''}
          </FieldErrorMsg>
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
            lifecycleCosts={lifecycleCosts}
            removeCategory={removeCategory}
            total={calculateCategoryCost('development')}
          />
          <Phase
            category="operationsMaintenance"
            formikKey={formikKey}
            fiscalYear={fiscalYear}
            setFieldValue={setFieldValue}
            lifecycleCosts={lifecycleCosts}
            removeCategory={removeCategory}
            total={calculateCategoryCost('operationsMaintenance')}
          />
          {relatedCosts.map((cost: any) => {
            return (
              <Phase
                key={cost}
                category={cost}
                formikKey={formikKey}
                fiscalYear={fiscalYear}
                setFieldValue={setFieldValue}
                lifecycleCosts={lifecycleCosts}
                removeCategory={removeCategory}
                total={calculateCategoryCost(cost)}
              />
            );
          })}
          <OtherCosts
            lifecycleCosts={lifecycleCosts}
            relatedCosts={relatedCosts}
            setRelatedCosts={addRelatedCost}
          />
        </FieldGroup>
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
