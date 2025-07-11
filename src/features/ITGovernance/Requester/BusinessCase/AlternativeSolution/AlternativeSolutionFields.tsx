import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, Label, Radio, TextInput } from '@trussworks/react-uswds';
import { Field, FormikProps } from 'formik';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import { ZERO_TRUST_LEARN_MORE } from 'constants/externalUrls';
import flattenErrors from 'utils/flattenErrors';

type AlternativeSolutionFieldsProps = {
  altLetter: string;
  businessCaseCreatedAt: string;
  formikProps: FormikProps<any>;
  isFinal: boolean;
};

const AlternativeSolutionFields = ({
  altLetter,
  businessCaseCreatedAt,
  formikProps,
  isFinal
}: AlternativeSolutionFieldsProps) => {
  const { t } = useTranslation('businessCase');

  const { values, errors = {}, setFieldValue } = formikProps;

  const altId = `alternative${altLetter}`;

  const flatErrors = flattenErrors(errors);

  return (
    <>
      {/* Required fields help text and alert */}{' '}
      <HelpText className="margin-top-1 text-base">
        <Trans
          i18nKey="businessCase:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>
      {!isFinal && (
        <Alert
          type="info"
          className="margin-top-2"
          data-testid="draft-business-case-fields-alert"
          slim
        >
          {t('businessCase:draftAlert')}
        </Alert>
      )}
      <div
        data-testid="alternative-solution-fields"
        className="tablet:grid-col-9"
      >
        <FieldGroup
          scrollElement={`${altId}.title`}
          error={!!flatErrors[`${altId}.title`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Title`}>
            {t('solutionTitle')}
            <RequiredAsterisk />
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
            {t('solutionSummary.label')}
            <RequiredAsterisk />
          </Label>
          <HelpText
            id={`BusinessCase-${altId}SummaryHelp`}
            className="margin-top-1"
          >
            {t('solutionSummary.include')}
            <ul className="padding-left-205 margin-top-1 margin-bottom-0">
              <li>{t('solutionSummary.summary')}</li>
              <li>{t('solutionSummary.implementation')}</li>
              <li>{t('solutionSummary.costs')}</li>
              <li>{t('solutionSummary.approaches')}</li>
            </ul>
          </HelpText>
          <FieldErrorMsg>{flatErrors[`${altId}.summary`]}</FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.summary`]}
            id={`BusinessCase-${altId}Summary`}
            maxLength={10000}
            name={`${altId}.summary`}
            aria-describedby={`BusinessCase-${altId}SummaryCounter BusinessCase-${altId}SummaryHelp`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.acquisitionApproach`}
          error={!!flatErrors[`${altId}.acquisitionApproach`]}
        >
          <Label htmlFor={`BusinessCase-${altId}AcquisitionApproach`}>
            {t('solutionAcquisitionApproach')}
            <RequiredAsterisk />
          </Label>
          <HelpText
            id={`BusinessCase-${altId}AcquisitionApproachHelp`}
            className="margin-top-1"
          >
            {t('solutionAcquisitionApproachHelpText')}
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

        {/* Target dataes */}
        <Grid row gap>
          {/* Target contract award */}
          <Grid tablet={{ col: 6 }}>
            <div className="height-full display-flex flex-column">
              <div className="flex-fill">
                <Label
                  htmlFor={`BusinessCase-${altId}TargetContractAwardDate`}
                  className="margin-bottom-1"
                >
                  {t('targetContractAwardDate')}
                </Label>
                <HelpText>{t('targetContractAwardDateHelpText')}</HelpText>
                <HelpText>{t('dateFormat')}</HelpText>
              </div>
              <Field
                as={DatePickerFormatted}
                error={!!flatErrors[`${altId}.targetContractAwardDate`]}
                onChange={(date: string) => {
                  setFieldValue(`${altId}.targetContractAwardDate`, date);
                }}
                id={`BusinessCase-${altId}TargetContractAwardDate`}
                name={`${altId}.targetContractAwardDate`}
                aria-describedby={`BusinessCase-${altId}TargetContractAwardDateHelp`}
              />
            </div>
          </Grid>

          {/* Target completion date */}
          <Grid tablet={{ col: 6 }}>
            <div className="height-full display-flex flex-column">
              <div className="flex-fill">
                <Label
                  htmlFor={`BusinessCase-${altId}TargetCompletionDate`}
                  className="margin-bottom-1"
                >
                  {t('targetCompletionDate')}
                </Label>
                <HelpText>{t('targetCompletionDateHelpText')}</HelpText>
                <HelpText>{t('dateFormat')}</HelpText>
              </div>
              <Field
                as={DatePickerFormatted}
                error={!!flatErrors[`${altId}.targetCompletionDate`]}
                onChange={(date: string) => {
                  setFieldValue(`${altId}.targetCompletionDate`, date);
                }}
                id={`BusinessCase-${altId}TargetCompletionDate`}
                name={`${altId}.targetCompletionDate`}
                aria-describedby={`BusinessCase-${altId}TargetCompletionDateHelp`}
              />
            </div>
          </Grid>
        </Grid>

        <FieldGroup
          scrollElement={`${altId}.security.isApproved`}
          error={!!flatErrors[`${altId}.security.isApproved`]}
          data-testid="security-approval"
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label maxw-none">
              {t('isApproved')}
              <RequiredAsterisk />
            </legend>
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
            className="margin-y-1 margin-left-4"
            scrollElement={`${altId}.security.isBeingReviewed`}
            error={!!flatErrors[`${altId}.security.isBeingReviewed`]}
            data-testid="security-approval-in-progress"
          >
            <fieldset className="usa-fieldset margin-top-2">
              <legend className="usa-label margin-bottom-1">
                {t('isBeingReviewed')}
                <RequiredAsterisk />
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
          scrollElement={`${altId}.zeroTrustAlignment`}
          error={!!flatErrors[`${altId}.zeroTrustAlignment`]}
        >
          <Label
            htmlFor={`BusinessCase-${altId}ZeroTrustAlignment`}
            className="maxw-none"
          >
            {t('zeroTrustAlignment')}
            <RequiredAsterisk />
          </Label>
          <HelpText
            id={`BusinessCase-${altId}ZeroTrustAlignmentHelp`}
            className="margin-top-1"
          >
            <Trans
              i18nKey="businessCase:zeroTrustAlignmentHelpText"
              components={{
                a: <a href={ZERO_TRUST_LEARN_MORE}> Click here </a>
              }}
            />
          </HelpText>
          <FieldErrorMsg>
            {flatErrors[`${altId}.zeroTrustAlignment`]}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.zeroTrustAlignment`]}
            id={`BusinessCase-${altId}ZeroTrustAlignment`}
            maxLength={10000}
            name={`${altId}.zeroTrustAlignment`}
            aria-describedby={`BusinessCase-${altId}ZeroTrustAlignmentCounter BusinessCase-${altId}ZeroTrustAlignmentHelp`}
          />
        </FieldGroup>

        <FieldGroup
          scrollElement={`${altId}.hosting.type`}
          error={!!flatErrors[`${altId}.hosting.type`]}
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label">
              {t('hostingType')}
              <RequiredAsterisk />
            </legend>
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
                    <RequiredAsterisk />
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
                  scrollElement={`${altId}.hosting.cloudStrategy`}
                  error={!!flatErrors[`${altId}.hosting.cloudStrategy`]}
                >
                  <Label htmlFor={`BusinessCase-${altId}CloudStrategy`}>
                    {t('cloudStrategy')}
                    <RequiredAsterisk />
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors[`${altId}.hosting.cloudStrategy`]}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors[`${altId}.hosting.cloudStrategy`]}
                    id={`BusinessCase-${altId}CloudStrategy`}
                    maxLength={50}
                    name={`${altId}.hosting.cloudStrategy`}
                  />
                </FieldGroup>

                <FieldGroup
                  className="margin-bottom-1 margin-left-4"
                  scrollElement={`${altId}.hosting.cloudServiceType`}
                  error={!!flatErrors[`${altId}.hosting.cloudServiceType`]}
                >
                  <Label htmlFor={`BusinessCase-${altId}CloudServiceType`}>
                    {t('cloudServiceType')}
                    <RequiredAsterisk />
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
                  <RequiredAsterisk />
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
            <legend className="usa-label maxw-none">
              {t('hasUserInterface')}
              <RequiredAsterisk />
            </legend>
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
          scrollElement={`${altId}.workforceTrainingReqs`}
          error={!!flatErrors[`${altId}.workforceTrainingReqs`]}
        >
          <Label
            htmlFor={`BusinessCase-${altId}WorkforceTrainingReqs`}
            className="maxw-none margin-bottom-2"
          >
            {t('workforceTrainingReqs')}
            <RequiredAsterisk />
          </Label>
          <FieldErrorMsg>
            {flatErrors[`${altId}.workforceTrainingReqs`]}
          </FieldErrorMsg>
          <Field
            as={TextAreaField}
            error={!!flatErrors[`${altId}.workforceTrainingReqs`]}
            id={`BusinessCase-${altId}WorkforceTrainingReqs`}
            maxLength={10000}
            name={`${altId}.workforceTrainingReqs`}
          />
        </FieldGroup>

        <hr className="margin-bottom-1 margin-top-4 opacity-30" aria-hidden />
        <>
          <h4>{t('prosAndCons')}</h4>
          <p>{t('prosAndConsHelpText')}</p>
        </>

        <FieldGroup
          scrollElement={`${altId}.pros`}
          error={!!flatErrors[`${altId}.pros`]}
        >
          <Label htmlFor={`BusinessCase-${altId}Pros`}>
            {t('pros.label')}
            <RequiredAsterisk />
          </Label>
          <HelpText
            id={`BusinessCase-${altId}ProsHelp`}
            className="margin-top-1"
          >
            {t('pros.include')}
            <ul className="padding-left-205 margin-top-1 margin-bottom-0">
              <li>
                <Trans
                  i18nKey="businessCase:pros.immediateImpact"
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>
              <li>
                <Trans
                  i18nKey="businessCase:pros.downstreamImpact"
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>
            </ul>
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
            {t('cons.label')}
            <RequiredAsterisk />
          </Label>
          <HelpText
            id={`BusinessCase-${altId}ConsHelp`}
            className="margin-top-1"
          >
            {t('cons.include')}
            <ul className="padding-left-205 margin-top-1 margin-bottom-0">
              <li>
                <Trans
                  i18nKey="businessCase:cons.immediateImpact"
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>
              <li>
                <Trans
                  i18nKey="businessCase:cons.downstreamImpact"
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>
              <li>
                <Trans
                  i18nKey="businessCase:cons.downsides"
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>
            </ul>
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
      <hr className="margin-bottom-4 margin-top-4 opacity-30" aria-hidden />
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
        <Label
          htmlFor={`BusinessCase-${altId}CostSavings`}
          className="maxw-none"
        >
          {t('costSavings')}
          <RequiredAsterisk />
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
