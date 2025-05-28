import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Grid,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import DatePickerFormatted from 'components/DatePickerFormatted';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import { ZERO_TRUST_LEARN_MORE } from 'constants/externalUrls';
import { yesNoMap } from 'data/common';
import { BusinessCaseModel, PreferredSolutionForm } from 'types/businessCase';
import { LifecycleCosts } from 'types/estimatedLifecycle';
import flattenErrors from 'utils/flattenErrors';
import { getSingleSolutionSchema } from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

type PreferredSolutionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};
const PreferredSolution = ({
  businessCase,
  formikRef,
  dispatchSave,
  isFinal
}: PreferredSolutionProps) => {
  const { t } = useTranslation('businessCase');
  const history = useHistory();

  const initialValues = {
    preferredSolution: businessCase.preferredSolution
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={getSingleSolutionSchema(isFinal, 'preferredSolution')}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<PreferredSolutionForm>) => {
        const { values, errors, setFieldValue, validateForm } = formikProps;

        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            title={t('preferredSolution')}
            systemIntakeId={businessCase.systemIntakeId}
            data-testid="preferred-solution"
            errors={flatErrors}
          >
            <Form>
              <div className="tablet:grid-col-9">
                <IconButton
                  type="button"
                  icon={<Icon.ArrowBack />}
                  className="margin-bottom-3 margin-top-2"
                  onClick={() => {
                    dispatchSave();
                    history.push(
                      `/business/${businessCase.systemIntakeId}/alternative-analysis`
                    );
                  }}
                  unstyled
                >
                  {t('saveAndReturnToBusinessCase')}
                </IconButton>

                {/* Required fields help text and alert */}
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
                    {t('alternativesDescription.draftAlternativesAlert')}
                  </Alert>
                )}

                <FieldGroup
                  scrollElement="preferredSolution.title"
                  error={!!flatErrors['preferredSolution.title']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionTitle">
                    {t('solutionTitle')}
                    <RequiredAsterisk />
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.title']}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors['preferredSolution.title']}
                    id="BusinessCase-PreferredSolutionTitle"
                    maxLength={50}
                    name="preferredSolution.title"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.summary"
                  error={!!flatErrors['preferredSolution.summary']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionSummary">
                    {t('solutionSummary.label')}
                    <RequiredAsterisk />
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionSummaryHelp"
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
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.summary']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors['preferredSolution.summary']}
                    id="BusinessCase-PreferredSolutionSummary"
                    maxLength={10000}
                    name="preferredSolution.summary"
                    aria-describedby="BusinessCase-PreferredSolutionSummaryCounter BusinessCase-PreferredSolutionSummaryHelp"
                  />
                </FieldGroup>

                {/* Target dataes */}
                <Grid row gap>
                  {/* Target contract award date */}
                  <Grid tablet={{ col: 6 }}>
                    <div className="height-full display-flex flex-column">
                      <div className="flex-fill">
                        <Label
                          htmlFor="BusinessCase-PreferredSolutionTargetContractAwardDate"
                          className="margin-bottom-1"
                        >
                          {t('targetContractAwardDate')}
                        </Label>
                        <HelpText>
                          {t('targetContractAwardDateHelpText')}
                        </HelpText>
                        <HelpText>{t('dateFormat')}</HelpText>
                      </div>
                      <Field
                        as={DatePickerFormatted}
                        error={
                          !!flatErrors[
                            'preferredSolution.targetContractAwardDate'
                          ]
                        }
                        onChange={(date: DateTime) => {
                          // Convert the DateTime object to a string for consistent storage
                          const dateString = date ? date.toLocaleString() : '';
                          setFieldValue(
                            'preferredSolution.targetContractAwardDate',
                            dateString
                          );
                        }}
                        id="BusinessCase-PreferredSolutionTargetContractAwardDate"
                        name="preferredSolution.targetContractAwardDate"
                        aria-describedby="BusinessCase-PreferredSolutionTargetContractAwardDateHelp"
                      />
                    </div>
                  </Grid>

                  {/* Target completion date */}
                  <Grid tablet={{ col: 6 }}>
                    <div className="display-flex flex-column">
                      <div className="flex-fill">
                        <Label
                          htmlFor="BusinessCase-PreferredSolutionTargetCompletionDate"
                          className="margin-bottom-1"
                        >
                          {t('targetCompletionDate')}
                        </Label>
                        <HelpText>{t('targetCompletionDateHelpText')}</HelpText>
                        <HelpText>{t('dateFormat')}</HelpText>
                      </div>
                      <Field
                        as={DatePickerFormatted}
                        error={
                          !!flatErrors['preferredSolution.targetCompletionDate']
                        }
                        onChange={(date: DateTime) => {
                          // Convert the DateTime object to a string for consistent storage
                          const dateString = date ? date.toLocaleString() : '';
                          setFieldValue(
                            'preferredSolution.targetCompletionDate',
                            dateString
                          );
                        }}
                        id="BusinessCase-PreferredSolutionTargetCompletionDate"
                        name="preferredSolution.targetCompletionDate"
                        aria-describedby="BusinessCase-PreferredSolutionTargetCompletionDateHelp"
                      />
                    </div>
                  </Grid>
                </Grid>

                <FieldGroup
                  scrollElement="preferredSolution.acquisitionApproach"
                  error={!!flatErrors['preferredSolution.acquisitionApproach']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionAcquisitionApproach">
                    {t('solutionAcquisitionApproach')}
                    <RequiredAsterisk />
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionAcquisitionApproachHelp"
                    className="margin-top-1"
                  >
                    {t('solutionAcquisitionApproachHelpText')}
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.acquisitionApproach']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={
                      !!flatErrors['preferredSolution.acquisitionApproach']
                    }
                    id="BusinessCase-PreferredSolutionAcquisitionApproach"
                    maxLength={10000}
                    name="preferredSolution.acquisitionApproach"
                    aria-describedby="BusinessCase-PreferredSolutionAcquisitionApproachCounter BusinessCase-PreferredSolutionAcquisitionApproachHelp"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.security.isApproved"
                  error={!!flatErrors['preferredSolution.security.isApproved']}
                  data-testid="security-approval"
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label maxw-none">
                      {t('isApproved')}
                      <RequiredAsterisk />
                    </legend>
                    <FieldErrorMsg>
                      {flatErrors['preferredSolution.security.isApproved']}
                    </FieldErrorMsg>
                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.security.isApproved === true
                      }
                      id="BusinessCase-PreferredSolutionSecurityApproved"
                      name="preferredsolution.security.isApproved"
                      label={yesNoMap.YES}
                      onChange={() => {
                        setFieldValue(
                          'preferredSolution.security.isApproved',
                          true
                        );
                      }}
                    />

                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.security.isApproved === false
                      }
                      id="BusinessCase-PreferredSolutionSecurityNotApproved"
                      name="preferredsolution.security.isApproved"
                      label={yesNoMap.NO}
                      onChange={() => {
                        setFieldValue(
                          'preferredSolution.security.isApproved',
                          false
                        );
                        setFieldValue(
                          'preferredSolution.security.isBeingReviewed',
                          ''
                        );
                      }}
                    />
                  </fieldset>
                </FieldGroup>

                {values.preferredSolution.security.isApproved === false && (
                  <FieldGroup
                    className="margin-y-1 margin-left-4"
                    scrollElement="preferredSolution.security.isBeingReviewed"
                    error={
                      !!flatErrors['preferredSolution.security.isBeingReviewed']
                    }
                    data-testid="security-approval-in-progress"
                  >
                    <fieldset className="usa-fieldset margin-top-2">
                      <legend className="usa-label margin-bottom-1">
                        {t('isBeingReviewed')}
                        <RequiredAsterisk />
                      </legend>
                      <HelpText id="BusinessCase-PreferredSolutionApprovalHelp">
                        {t('isBeingReviewedHelpText')}
                      </HelpText>
                      <FieldErrorMsg>
                        {
                          flatErrors[
                            'preferredSolution.security.isBeingReviewed'
                          ]
                        }
                      </FieldErrorMsg>
                      <Field
                        as={Radio}
                        checked={
                          values.preferredSolution.security.isBeingReviewed ===
                          'YES'
                        }
                        id="BusinessCase-PreferredSolutionSecurityIsBeingReviewedYes"
                        name="preferredSolution.security.isBeingReviewed"
                        label={yesNoMap.YES}
                        value="YES"
                        aria-describedby="BusinessCase-PreferredSolutionApprovalHelp"
                      />
                      <Field
                        as={Radio}
                        checked={
                          values.preferredSolution.security.isBeingReviewed ===
                          'NO'
                        }
                        id="BusinessCase-PreferredSolutionSecurityIsBeingReviewedNo"
                        name="preferredSolution.security.isBeingReviewed"
                        label={yesNoMap.NO}
                        value="NO"
                      />
                      <Field
                        as={Radio}
                        checked={
                          values.preferredSolution.security.isBeingReviewed ===
                          'NOT_SURE'
                        }
                        id="BusinessCase-PreferredSolutionSecurityIsBeingReviewedNotSure"
                        name="preferredSolution.security.isBeingReviewed"
                        label={yesNoMap.NOT_SURE}
                        value="NOT_SURE"
                      />
                    </fieldset>
                  </FieldGroup>
                )}

                <FieldGroup
                  scrollElement="preferredSolution.security.zeroTrustAlignment"
                  error={
                    !!flatErrors[
                      'preferredSolution.security.zeroTrustAlignment'
                    ]
                  }
                >
                  <Label
                    htmlFor="BusinessCase-PreferredSolutionZeroTrustAlignment"
                    className="maxw-none"
                  >
                    {t('zeroTrustAlignment')}
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionZeroTrustAlignmentHelp"
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
                    {
                      flatErrors[
                        'preferredSolution.security.zeroTrustAlignment'
                      ]
                    }
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={
                      !!flatErrors[
                        'preferredSolution.security.zeroTrustAlignment'
                      ]
                    }
                    id="BusinessCase-PreferredSolutionZeroTrustAlignment"
                    maxLength={2000}
                    name="preferredSolution.security.zeroTrustAlignment"
                    aria-describedby="BusinessCase-PreferredSolutionZeroTrustAlignmentCounter BusinessCase-PreferredSolutionZeroTrustAlignmentHelp"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.hosting.type"
                  error={!!flatErrors['preferredSolution.hosting.type']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label">
                      {t('hostingType')} <RequiredAsterisk />
                    </legend>
                    <FieldErrorMsg>
                      {flatErrors['preferredSolution.hosting.type']}
                    </FieldErrorMsg>

                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.hosting.type === 'cloud'
                      }
                      id="BusinessCase-PreferredSolutionHostingCloud"
                      name="preferredSolution.hosting.type"
                      label={t('hostingTypeCloud')}
                      value="cloud"
                      onChange={() => {
                        setFieldValue(
                          'preferredSolution.hosting.type',
                          'cloud'
                        );
                        setFieldValue('preferredSolution.hosting.location', '');
                        setFieldValue(
                          'preferredSolution.hosting.cloudServiceType',
                          ''
                        );
                      }}
                    />
                    {values.preferredSolution.hosting.type === 'cloud' && (
                      <>
                        <FieldGroup
                          className="margin-y-1 margin-left-4"
                          scrollElement="preferredSolution.hosting.location"
                          error={
                            !!flatErrors['preferredSolution.hosting.location']
                          }
                        >
                          <Label htmlFor="BusinessCase-PreferredSolutionCloudLocation">
                            {t('hostingLocation')}
                            <RequiredAsterisk />
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['preferredSolution.hosting.location']}
                          </FieldErrorMsg>
                          <Field
                            as={TextInput}
                            error={
                              !!flatErrors['preferredSolution.hosting.location']
                            }
                            id="BusinessCase-PreferredSolutionCloudLocation"
                            maxLength={50}
                            name="preferredSolution.hosting.location"
                          />
                        </FieldGroup>

                        <FieldGroup
                          className="margin-bottom-1 margin-left-4"
                          scrollElement="preferredSolution.hosting.cloudStrategy"
                          error={
                            !!flatErrors[
                              'preferredSolution.hosting.cloudStrategy'
                            ]
                          }
                        >
                          <Label htmlFor="BusinessCase-PreferredSolutionCloudStrategy">
                            {t('cloudStrategy')}
                            <RequiredAsterisk />
                          </Label>
                          <FieldErrorMsg>
                            {
                              flatErrors[
                                'preferredSolution.hosting.cloudStrategy'
                              ]
                            }
                          </FieldErrorMsg>
                          <Field
                            as={TextInput}
                            error={
                              !!flatErrors[
                                'preferredSolution.hosting.cloudStrategy'
                              ]
                            }
                            id="BusinessCase-PreferredSolutionCloudStrategy"
                            maxLength={50}
                            name="preferredSolution.hosting.cloudStrategy"
                          />
                        </FieldGroup>

                        <FieldGroup
                          className="margin-bottom-1 margin-left-4"
                          scrollElement="preferredSolution.hosting.cloudServiceType"
                          error={
                            !!flatErrors[
                              'preferredSolution.hosting.cloudServiceType'
                            ]
                          }
                        >
                          <Label htmlFor="BusinessCase-PreferredSolutionCloudServiceType">
                            {t('cloudServiceType')}
                            <RequiredAsterisk />
                          </Label>
                          <FieldErrorMsg>
                            {
                              flatErrors[
                                'preferredSolution.hosting.cloudServiceType'
                              ]
                            }
                          </FieldErrorMsg>
                          <Field
                            as={TextInput}
                            error={
                              !!flatErrors[
                                'preferredSolution.hosting.cloudServiceType'
                              ]
                            }
                            id="BusinessCase-PreferredSolutionCloudServiceType"
                            maxLength={50}
                            name="preferredSolution.hosting.cloudServiceType"
                          />
                        </FieldGroup>
                      </>
                    )}
                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.hosting.type === 'dataCenter'
                      }
                      id="BusinessCase-PreferredSolutionHostingDataCenter"
                      name="preferredSolution.hosting.type"
                      label={t('hostingTypeDataCenter')}
                      value="dataCenter"
                      onChange={() => {
                        setFieldValue(
                          'preferredSolution.hosting.type',
                          'dataCenter'
                        );
                        setFieldValue('preferredSolution.hosting.location', '');
                        setFieldValue(
                          'preferredSolution.hosting.cloudServiceType',
                          ''
                        );
                      }}
                    />

                    {values.preferredSolution.hosting.type === 'dataCenter' && (
                      <FieldGroup
                        className="margin-yx-1 margin-left-4"
                        scrollElement="preferredSolution.hosting.location"
                        error={
                          !!flatErrors['preferredSolution.hosting.location']
                        }
                      >
                        <Label htmlFor="BusinessCase-PreferredSolutionDataCenterLocation">
                          {t('dataCenterLocation')}
                          <RequiredAsterisk />
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['preferredSolution.hosting.location']}
                        </FieldErrorMsg>
                        <Field
                          as={TextInput}
                          error={
                            !!flatErrors['preferredSolution.hosting.location']
                          }
                          id="BusinessCase-PreferredSolutionDataCenterLocation"
                          maxLength={50}
                          name="preferredSolution.hosting.location"
                        />
                      </FieldGroup>
                    )}

                    <Field
                      as={Radio}
                      checked={values.preferredSolution.hosting.type === 'none'}
                      id="BusinessCase-PreferredSolutionHostingNone"
                      name="preferredSolution.hosting.type"
                      label={t('noHostingNeeded')}
                      value="none"
                      onChange={() => {
                        setFieldValue('preferredSolution.hosting.type', 'none');
                        setFieldValue('preferredSolution.hosting.location', '');
                        setFieldValue(
                          'preferredSolution.hosting.cloudServiceType',
                          ''
                        );
                      }}
                    />
                  </fieldset>
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.hasUserInterface"
                  error={!!flatErrors['preferredSolution.hasUserInterface']}
                  data-testid="user-interface-group"
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label maxw-none">
                      {t('hasUserInterface')}
                      <RequiredAsterisk />
                    </legend>
                    <FieldErrorMsg>
                      {flatErrors['preferredSolution.hasUserInterface']}
                    </FieldErrorMsg>

                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.hasUserInterface === 'YES'
                      }
                      id="BusinessCase-PreferredHasUserInferfaceYes"
                      name="preferredSolution.hasUserInterface"
                      label={t('Yes')}
                      value="YES"
                    />

                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.hasUserInterface === 'NO'
                      }
                      id="BusinessCase-PreferredHasUserInferfaceNo"
                      name="preferredSolution.hasUserInterface"
                      label={t('No')}
                      value="NO"
                    />

                    <Field
                      as={Radio}
                      checked={
                        values.preferredSolution.hasUserInterface === 'NOT_SURE'
                      }
                      id="BusinessCase-PreferredHasUserInferfaceNotSure"
                      name="preferredSolution.hasUserInterface"
                      label={t('notSure')}
                      value="NOT_SURE"
                    />
                  </fieldset>
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.workforceTrainingReqs"
                  error={
                    !!flatErrors['preferredSolution.workforceTrainingReqs']
                  }
                >
                  <Label
                    htmlFor="BusinessCase-PreferredWorkforceTrainingReqs"
                    className="maxw-none margin-bottom-2"
                  >
                    {t('workforceTrainingReqs')}
                    <RequiredAsterisk />
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.workforceTrainingReqs']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.workforceTrainingReqs}
                    id="BusinessCase-PreferredWorkforceTrainingReqs"
                    maxLength={2000}
                    name="preferredSolution.workforceTrainingReqs"
                    aria-describedby="BusinessCase-PreferredWorkforceTrainingReqsCounter BusinessCase-PreferredWorkforceTrainingReqsHelp"
                  />
                </FieldGroup>

                <hr
                  className="margin-bottom-1 margin-top-4 opacity-30"
                  aria-hidden
                />
                <>
                  <h4>{t('prosAndCons')}</h4>
                  <p>{t('prosAndConsHelpText')}</p>
                </>

                <FieldGroup
                  scrollElement="preferredSolution.pros"
                  error={!!flatErrors['preferredSolution.pros']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionPros">
                    {t('pros.label')}
                    <RequiredAsterisk />
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionProsHelp"
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
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.pros']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors['preferredSolution.pros']}
                    id="BusinessCase-PreferredSolutionPros"
                    maxLength={10000}
                    name="preferredSolution.pros"
                    aria-describedby="BusinessCase-PreferredSolutionProsCounter BusinessCase-PreferredSolutionProsHelp"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.cons"
                  error={!!flatErrors['preferredSolution.cons']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionCons">
                    {t('cons.label')}
                    <RequiredAsterisk />
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionConsHelp"
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
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.cons']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors['preferredSolution.cons']}
                    id="BusinessCase-PreferredSolutionCons"
                    maxLength={10000}
                    name="preferredSolution.cons"
                    aria-describedby="BusinessCase-PreferredSolutionConsCounter BusinessCase-PreferredSolutionConsHelp"
                  />
                </FieldGroup>
              </div>

              <hr
                className="margin-bottom-4 margin-top-4 opacity-30"
                aria-hidden
              />

              <EstimatedLifecycleCost
                className="margin-top-2"
                formikKey="preferredSolution.estimatedLifecycleCost"
                lifecycleCosts={values.preferredSolution.estimatedLifecycleCost}
                businessCaseCreatedAt={businessCase.createdAt}
                errors={
                  errors.preferredSolution &&
                  errors.preferredSolution.estimatedLifecycleCost
                }
                setFieldValue={
                  setFieldValue as FormikHelpers<LifecycleCosts>['setFieldValue']
                }
              />

              <FieldGroup
                scrollElement="preferredSolution.costSavings"
                error={!!flatErrors['preferredSolution.costSavings']}
                className="tablet:grid-col-9 margin-bottom-6"
              >
                <Label
                  htmlFor="BusinessCase-PreferredSolutionCostSavings"
                  className="maxw-none"
                >
                  {t('costSavings')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-PreferredSolutionCostSavingsHelp"
                  className="margin-top-1"
                >
                  {t('costSavingsHelpText')}
                </HelpText>
                <FieldErrorMsg>
                  {flatErrors['preferredSolution.costSavings']}
                </FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors['preferredSolution.costSavings']}
                  id="BusinessCase-PreferredSolutionCostSavings"
                  maxLength={2000}
                  name="preferredSolution.costSavings"
                  aria-describedby="BusinessCase-PreferredSolutionCostSavingsCounter BusinessCase-PreferredSolutionCostSavingsHelp"
                />
              </FieldGroup>
            </Form>

            <hr
              className="margin-bottom-2 margin-top-4 opacity-30"
              aria-hidden
            />

            <Button
              type="button"
              onClick={() => {
                validateForm().then(err => {
                  if (Object.keys(err).length === 0) {
                    dispatchSave();
                    const newUrl = 'alternative-analysis';
                    history.push(newUrl);
                  } else {
                    window.scrollTo(0, 0);
                  }
                });
              }}
            >
              {t('Finish preferred solution')}
            </Button>

            <IconButton
              type="button"
              icon={<Icon.ArrowBack />}
              className="margin-bottom-3 margin-top-3"
              data-testid="save-and-return-button"
              onClick={() => {
                dispatchSave();
                history.push(
                  `/business/${businessCase.systemIntakeId}/alternative-analysis`
                );
              }}
              unstyled
            >
              {t('saveAndReturnToBusinessCase')}
            </IconButton>

            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />
          </BusinessCaseStepWrapper>
        );
      }}
    </Formik>
  );
};

export default PreferredSolution;
