import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Radio, TextInput } from '@trussworks/react-uswds';
import { Field, FormikProps } from 'formik';

import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import TextAreaField from 'components/TextAreaField';
import flattenErrors from 'utils/flattenErrors';

type AlternativeSolutionFieldsProps = {
  altLetter: string;
  businessCaseCreatedAt: string;
  formikProps: FormikProps<any>;
};

const AlternativeSolutionFields = ({
  altLetter,
  businessCaseCreatedAt,
  formikProps
}: AlternativeSolutionFieldsProps) => {
  const { t } = useTranslation('businessCase');

  const { values, errors = {}, setFieldValue } = formikProps;

  const altLabel = t('alternativeLabel', { altLetter });

  const altId = `alternative${altLetter}`;

  const flatErrors = flattenErrors(errors);

  return (
    <>
      <div
        data-testid="alternative-solution-fields"
        className="tablet:grid-col-9"
      >
        <FieldGroup
          scrollElement={`${altId}.title`}
          error={!!flatErrors[`${altId}.title`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Title`}>
            {t('alternativeLabels.title', { altLabel })}
          </Label>
          <FieldErrorMsg>{flatErrors[`${altId}.title`]}</FieldErrorMsg>
          <Field
            as={TextInput}
            error={!!flatErrors[`${altId}.title`]}
            id={`BusinessCase-${altId}Title`}
            maxLength={50}
            name={`${altId}.title`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.summary`}
          error={!!flatErrors[`${altId}.summary`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Summary`}>
            {t('alternativeLabels.summary', { altLabel })}
          </Label>
          <HelpText
            id={`BusinessCase-${altId}SummaryHelp`}
            className="margin-top-1"
          >
            {t('preferredSolutionSummary.include')}
            <ul className="padding-left-205 margin-top-1 margin-bottom-0">
              <li>{t('preferredSolutionSummary.summary')}</li>
              <li>{t('preferredSolutionSummary.implementation')}</li>
              <li>{t('preferredSolutionSummary.costs')}</li>
              <li>{t('preferredSolutionSummary.approaches')}</li>
            </ul>
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.summary`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.summary`]}
            id={`BusinessCase-${altId}Summary`}
            maxLength={10000}
            name={`${altId}.summary`}
            aria-describedby={`BusinessCase-${altId}SummmaryCounter BusinessCase-${altId}SummaryHelp`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.acquisitionApproach`}
          error={!!flatErrors[`${altId}.acquisitionApproach`]}
        >
          <Label htmlFor={`BusinessCase-${altId}AcquisitionApproach`}>
            {t('alternativeLabels.acquisitionApproach', { altLabel })}
          </Label>
          <HelpText
            id={`BusinessCase-${altId}AcquisitionApproachHelp`}
            className="margin-top-1"
          >
            {t('preferredSolutionApproachHelpText')}
          </HelpText>
          <FieldErrorMsg>
            {flatErrors[`${altId}.acquisitionApproach`]}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={flatErrors[`${altId}.acquisitionApproach`]}
            id={`BusinessCase-${altId}AcquisitionApproach`}
            maxLength={10000}
            name={`${altId}.acquisitionApproach`}
            aria-describedby={`BusinessCase-${altId}AcquisitionApproachCounter BusinessCase-${altId}AcquisitionApproachHelp`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.security.isApproved`}
          error={!!flatErrors[`${altId}.security.isApproved`]}
          data-testid="security-approval"
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">{t('isApproved')}</legend>
            <FieldErrorMsg>
              {flatErrors[`${altId}.security.isApproved`]}
            </FieldErrorMsg>
            <Field
              as={Radio}
              checked={values[`${altId}`].security.isApproved === true}
              id={`BusinessCase-${altId}SecurityApproved`}
              name={`${altId}.security.isApproved`}
              label={t('Yes')}
              value
              onChange={() => {
                setFieldValue(`${altId}.security.isApproved`, true);
              }}
            />

            <Field
              as={Radio}
              checked={values[`${altId}`].security.isApproved === false}
              id={`BusinessCase-${altId}SecurityNotApproved`}
              name={`${altId}.security.isApproved`}
              label={t('No')}
              value={false}
              onChange={() => {
                setFieldValue(`${altId}.security.isApproved`, false);
                setFieldValue(`${altId}.security.isBeingReviewed`, '');
              }}
            />
          </fieldset>
        </FieldGroup>

        {values[`${altId}`].security.isApproved === false && (
          <FieldGroup
            scrollElement={`${altId}.security.isBeingReviewed`}
            error={!!flatErrors[`${altId}.security.isBeingReviewed`]}
            data-testid="security-approval-in-progress"
          >
            <fieldset className="usa-fieldset margin-top-4">
              <legend className="usa-label margin-bottom-1">
                {t('isBeingReviewed')}
              </legend>
              <HelpText id={`BusinessCase-${altId}SecurityReviewHelp`}>
                {t('isBeingReviewedHelpText')}
              </HelpText>
              <FieldErrorMsg>
                {flatErrors[`${altId}.security.isBeingReviewed`]}
              </FieldErrorMsg>
              <Field
                as={Radio}
                checked={values[`${altId}`].security.isBeingReviewed === 'YES'}
                id={`BusinessCase-${altId}SecurityIsBeingReviewedYed`}
                name={`${altId}.security.isBeingReviewed`}
                label={t('Yes')}
                value="YES"
                aria-describedby={`BusinessCase-${altId}SecurityReviewHelp`}
              />
              <Field
                as={Radio}
                checked={values[`${altId}`].security.isBeingReviewed === 'NO'}
                id={`BusinessCase-${altId}SecurityIsBeingReviewedNo`}
                name={`${altId}.security.isBeingReviewed`}
                label={t('No')}
                value="NO"
              />
              <Field
                as={Radio}
                checked={
                  values[`${altId}`].security.isBeingReviewed === 'NOT_SURE'
                }
                id={`BusinessCase-${altId}SecurityIsBeingReviewedNotSure`}
                name={`${altId}.security.isBeingReviewed`}
                label={t('notSure')}
                value="NOT_SURE"
              />
            </fieldset>
          </FieldGroup>
        )}

        <FieldGroup
          scrollElement={`${altId}.hosting.type`}
          error={!!flatErrors[`${altId}.hosting.type`]}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">{t('hostingType')}</legend>
            <FieldErrorMsg>{flatErrors[`${altId}.hosting.type`]}</FieldErrorMsg>

            <Field
              as={Radio}
              checked={values[`${altId}`].hosting.type === 'cloud'}
              id={`BusinessCase-${altId}HostingCloud`}
              name={`${altId}.hosting.type`}
              label={t('hostingTypeCloud')}
              value="cloud"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'cloud');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
            {values[`${altId}`].hosting.type === 'cloud' && (
              <>
                <FieldGroup
                  className="margin-y-1 margin-left-4"
                  scrollElement={`{${altId}.hosting.location`}
                  error={!!flatErrors[`${altId}.hosting.location`]}
                >
                  <Label htmlFor={`BusinessCase-${altId}CloudLocation`}>
                    {t('hostingLocation')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors[`${altId}.hosting.location`]}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors[`${altId}.hosting.location`]}
                    id={`BusinessCase-${altId}CloudLocation`}
                    maxLength={50}
                    name={`${altId}.hosting.location`}
                  />
                </FieldGroup>
                <FieldGroup
                  className="margin-bottom-1 margin-left-4"
                  scrollElement={`${altId}.hosting.cloudServiceType`}
                  error={!!flatErrors[`${altId}.hosting.cloudServiceType`]}
                >
                  <Label htmlFor={`BusinessCase-${altId}CloudServiceType`}>
                    {t('cloudServiceType')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors[`${altId}.hosting.cloudServiceType`]}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors[`${altId}.hosting.cloudServiceType`]}
                    id={`BusinessCase-${altId}CloudServiceType`}
                    maxLength={50}
                    name={`${altId}.hosting.cloudServiceType`}
                  />
                </FieldGroup>
              </>
            )}
            <Field
              as={Radio}
              checked={values[`${altId}`].hosting.type === 'dataCenter'}
              id={`BusinessCase-${altId}HostingDataCenter`}
              name={`${altId}.hosting.type`}
              label={t('hostingTypeDataCenter')}
              value="dataCenter"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'dataCenter');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
            {values[`${altId}`].hosting.type === 'dataCenter' && (
              <FieldGroup
                className="margin-y-1 margin-left-4"
                scrollElement={`${altId}.hosting.location`}
                error={!!flatErrors[`${altId}.hosting.location`]}
              >
                <Label htmlFor={`BusinessCase-${altId}DataCenterLocation`}>
                  {t('dataCenterLocation')}
                </Label>
                <FieldErrorMsg>
                  {flatErrors[`${altId}.hosting.location`]}
                </FieldErrorMsg>
                <Field
                  as={TextInput}
                  error={!!flatErrors[`${altId}.hosting.location`]}
                  id={`BusinessCase-${altId}DataCenterLocation`}
                  maxLength={50}
                  name={`${altId}.hosting.location`}
                />
              </FieldGroup>
            )}
            <Field
              as={Radio}
              checked={values[`${altId}`].hosting.type === 'none'}
              id={`BusinessCase-${altId}HostingNone`}
              name={`${altId}.hosting.type`}
              label={t('noHostingNeeded')}
              value="none"
              onChange={() => {
                setFieldValue(`${altId}.hosting.type`, 'none');
                setFieldValue(`${altId}.hosting.location`, '');
                setFieldValue(`${altId}.hosting.cloudServiceType`, '');
              }}
            />
          </fieldset>
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.hasUserInterface`}
          error={!!flatErrors[`${altId}.hasUserInterface`]}
          data-testid="user-interface-group"
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">{t('hasUserInterface')}</legend>
            <FieldErrorMsg>
              {flatErrors[`${altId}.hasUserInterface`]}
            </FieldErrorMsg>

            <Field
              as={Radio}
              checked={values[`${altId}`].hasUserInterface === 'YES'}
              id={`BusinessCase-${altId}HasUserInferfaceYes`}
              name={`${altId}.hasUserInterface`}
              label={t('Yes')}
              value="YES"
            />
            <Field
              as={Radio}
              checked={values[`${altId}`].hasUserInterface === 'NO'}
              id={`BusinessCase-${altId}HasUserInferfaceNo`}
              name={`${altId}.hasUserInterface`}
              label={t('No')}
              value="NO"
            />

            <Field
              as={Radio}
              checked={values[`${altId}`].hasUserInterface === 'NOT_SURE'}
              id={`BusinessCase-${altId}HasUserInferfaceNotSure`}
              name={`${altId}.hasUserInterface`}
              label={t('notSure')}
              value="NOT_SURE"
            />
          </fieldset>
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.pros`}
          error={!!flatErrors[`${altId}.pros`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Pros`}>
            {t('alternativeLabels.pros', { altLabel })}
          </Label>
          <HelpText
            id={`BusinessCase-${altId}ProsHelp`}
            className="margin-top-1"
          >
            {t('preferredSolutionProsHelpText')}
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.pros`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.pros`]}
            id={`BusinessCase-${altId}Pros`}
            maxLength={10000}
            name={`${altId}.pros`}
            aria-describedby={`BusinessCase-${altId}ProsCounter BusinessCase-${altId}ProsHelp`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.cons`}
          error={!!flatErrors[`${altId}.cons`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Cons`}>
            {t('alternativeLabels.cons', { altLabel })}
          </Label>
          <HelpText
            id={`BusinessCase-${altId}ConsHelp`}
            className="margin-top-1"
          >
            {t('preferredSolutionConsHelpText')}
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.cons`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.cons`]}
            id={`BusinessCase-${altId}Cons`}
            maxLength={10000}
            name={`${altId}.cons`}
            aria-describedby={`BusinessCase-${altId}ConsHelp BusinessCase-${altId}ConsCounter`}
          />
        </FieldGroup>
      </div>

      <EstimatedLifecycleCost
        className="margin-top-2"
        formikKey={`${altId}.estimatedLifecycleCost`}
        lifecycleCosts={values[`${altId}`].estimatedLifecycleCost}
        businessCaseCreatedAt={businessCaseCreatedAt}
        errors={
          errors &&
          errors[`${altId}`] &&
          // @ts-ignore
          errors[`${altId}`].estimatedLifecycleCost
        }
        setFieldValue={setFieldValue}
      />

      <FieldGroup
        scrollElement={`${altId}.costSavings`}
        error={!!flatErrors[`${altId}.costSavings`]}
        className="margin-top-2 margin-bottom-6 tablet:grid-col-9"
      >
        <Label htmlFor={`BusinessCase-${altId}CostSavings`}>
          {t('costSavings')}
        </Label>
        <HelpText
          id={`BusinessCase-${altId}CostSavingsHelp`}
          className="margin-top-1"
        >
          {t('costSavingsHelpText')}
        </HelpText>
        <FieldErrorMsg>{flatErrors[`${altId}.costSavings`]}</FieldErrorMsg>
        <Field
          as={TextAreaField}
          error={!!flatErrors[`${altId}.costSavings`]}
          id={`BusinessCase-${altId}CostSavings`}
          maxLength={2000}
          name={`${altId}.costSavings`}
          aria-describedby={`BusinessCase-${altId}CostSavingsCounter BusinessCase-${altId}CostSavingsHelp`}
        />
      </FieldGroup>
    </>
  );
};

export default AlternativeSolutionFields;
