import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  IconAdd,
  Label,
  Link as UswdsLink
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, FieldArray, FormikErrors, FormikHelpers } from 'formik';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
import {
  LifecycleCosts,
  LifecyclePhaseKey,
  LifecycleYears
} from 'types/estimatedLifecycle';
import { getFiscalYear, parseAsUTC } from 'utils/date';
import formatDollars from 'utils/formatDollars';

import LifecycleCostSummary from './CostSummary';

import './index.scss';

/** Keys for related lifecycle costs */
const relatedCostKeys: LifecyclePhaseKey[] = [
  'helpDesk',
  'software',
  'planning',
  'infrastructure',
  'oit',
  'other'
];

type PhaseProps = {
  category: LifecyclePhaseKey;
  formikKey: string;
  fiscalYear: number;
  setFieldValue: FormikHelpers<LifecycleCosts>['setFieldValue'];
  lifecycleCosts: LifecycleCosts;
  removeRelatedCost: (category: LifecyclePhaseKey) => void;
  total: number;
};

/** Component to display lifecycle costs for a specific phase */
const Phase = ({
  category,
  formikKey,
  fiscalYear,
  setFieldValue,
  lifecycleCosts,
  removeRelatedCost,
  total
}: PhaseProps) => {
  const { t } = useTranslation('businessCase');

  return (
    <FieldArray name={`${formikKey}.${category}`}>
      {() => (
        <FieldGroup
          className="est-lifecycle-cost__phase-costs margin-0"
          data-scroll={`${formikKey}.${category}.years`}
        >
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

                  {
                    // Remove category button
                    lifecycleCosts[category].type === 'related' && (
                      <Button
                        unstyled
                        type="button"
                        className="text-error"
                        onClick={() => removeRelatedCost(category)}
                      >
                        {t('lifecycleCost.removeCategory')}
                      </Button>
                    )
                  }
                </div>

                {
                  // Cost fields for each fiscal year
                  Object.keys(lifecycleCosts[category].years).map((year, i) => {
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
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue(
                              `${formikKey}.${category}.years.${year}`,
                              e.target.value.replace(/\D/g, '')
                            );
                          }}
                        />
                      </FieldGroup>
                    );
                  })
                }

                {/* Phase total cost */}
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

type AddRelatedCostFieldProps = {
  lifecycleCosts: LifecycleCosts;
  relatedCosts: LifecyclePhaseKey[];
  addRelatedCost: (category: LifecyclePhaseKey) => void;
};

/** Dropdown field to add related lifecycle cost to business case */
const AddRelatedCostField = ({
  lifecycleCosts,
  relatedCosts,
  addRelatedCost
}: AddRelatedCostFieldProps) => {
  const { t } = useTranslation('businessCase');

  const [activeRelatedCost, setActiveRelatedCost] =
    useState<LifecyclePhaseKey | null>(null);

  if (relatedCosts.length > 2) return null;

  return (
    <div className="cost-table-row cost-table-row__other">
      {
        // Add related cost button
        activeRelatedCost === null ? (
          <IconButton
            icon={<IconAdd />}
            type="button"
            unstyled
            onClick={() => setActiveRelatedCost('' as LifecyclePhaseKey)}
          >
            {t('lifecycleCost.addRelatedCost')}
          </IconButton>
        ) : (
          // Related cost dropdown
          <div className="desktop:display-flex flex-align-center">
            <Label htmlFor="newRelatedCostSelect">
              {t('lifecycleCost.newRelatedCost')}
            </Label>

            <select
              className="margin-y-2 desktop:margin-y-0 desktop:margin-x-2 usa-select"
              id="newRelatedCostSelect"
              value={activeRelatedCost}
              onChange={e =>
                setActiveRelatedCost(e.target.value as LifecyclePhaseKey)
              }
            >
              <option>- {t('Select')} -</option>
              {relatedCostKeys
                .filter(cost => !relatedCosts.includes(cost))
                .map(cost => {
                  return (
                    <option key={cost} value={cost}>
                      {lifecycleCosts[cost].label}
                    </option>
                  );
                })}
            </select>

            <Button
              type="submit"
              onClick={() => {
                if (lifecycleCosts[activeRelatedCost as LifecyclePhaseKey]) {
                  addRelatedCost(activeRelatedCost);
                }
                setActiveRelatedCost(null);
              }}
              disabled={!activeRelatedCost}
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
        )
      }
    </div>
  );
};

type EstimatedLifecycleCostProps = {
  formikKey: string;
  lifecycleCosts: LifecycleCosts;
  setFieldValue: FormikHelpers<LifecycleCosts>['setFieldValue'];
  errors?: FormikErrors<LifecycleCosts>;
  businessCaseCreatedAt?: string;
  className?: string;
};

/** Table to enter lifecycle cost fields for business case */
const EstimatedLifecycleCost = ({
  formikKey,
  lifecycleCosts,
  setFieldValue,
  errors,
  businessCaseCreatedAt = '',
  className
}: EstimatedLifecycleCostProps) => {
  const { t } = useTranslation('businessCase');

  /** Active related cost keys */
  const [relatedCosts, setRelatedCosts] = useState<LifecyclePhaseKey[]>(
    relatedCostKeys.filter(cost => lifecycleCosts[cost].isPresent)
  );

  /** Sum of all lifecycle costs for fiscal year */
  const sumCostinYear = (year: string) => {
    return Object.values(lifecycleCosts).reduce((total, current) => {
      const cost = current.years[year as keyof LifecycleYears];
      return total + (cost ? parseFloat(cost) : 0);
    }, 0);
  };

  /** Sum of all lifecycle costs for category */
  const calculateCategoryCost = (category: LifecyclePhaseKey) => {
    return Object.values(lifecycleCosts[category].years).reduce(
      (total, current) => {
        return total + (current ? parseFloat(current) : 0);
      },
      0
    );
  };

  /** Remove related cost category from table */
  const removeRelatedCost = (category: LifecyclePhaseKey) => {
    setRelatedCosts(relatedCosts.filter(cost => cost !== category));

    if (lifecycleCosts[category].isPresent) {
      // Set category `isPresent` field to false
      setFieldValue(`${formikKey}.${category}.isPresent`, false);

      // Reset all costs to empty string
      Object.keys(lifecycleCosts[category].years).forEach(year => {
        setFieldValue(`${formikKey}.${category}.years.${year}`, '');
      });
    }
  };

  /** Add related cost to table */
  const addRelatedCost = (category: LifecyclePhaseKey) => {
    setRelatedCosts([...relatedCosts, category]);
    setFieldValue(`${formikKey}.${category}.isPresent`, true);
  };

  /** Current fiscal year */
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

      <LifecycleCostSummary />

      <div className="cost-table margin-y-4">
        <FieldGroup error={!!errors}>
          <h4 className="margin-0">{t('lifecycleCost.tableHeading')}</h4>

          <HelpText className="margin-y-1">
            {t('lifecycleCost.tableDescription')}
          </HelpText>

          {
            // Phase error messages
            !!errors &&
              Object.values(errors).map((error, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <FieldErrorMsg key={index}>{error.years}</FieldErrorMsg>
              ))
          }

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
            removeRelatedCost={removeRelatedCost}
            total={calculateCategoryCost('development')}
          />

          <Phase
            category="operationsMaintenance"
            formikKey={formikKey}
            fiscalYear={fiscalYear}
            setFieldValue={setFieldValue}
            lifecycleCosts={lifecycleCosts}
            removeRelatedCost={removeRelatedCost}
            total={calculateCategoryCost('operationsMaintenance')}
          />

          {relatedCosts.map(cost => {
            return (
              <Phase
                key={cost}
                category={cost}
                formikKey={formikKey}
                fiscalYear={fiscalYear}
                setFieldValue={setFieldValue}
                lifecycleCosts={lifecycleCosts}
                removeRelatedCost={removeRelatedCost}
                total={calculateCategoryCost(cost)}
              />
            );
          })}

          <AddRelatedCostField
            lifecycleCosts={lifecycleCosts}
            relatedCosts={relatedCosts}
            addRelatedCost={addRelatedCost}
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
