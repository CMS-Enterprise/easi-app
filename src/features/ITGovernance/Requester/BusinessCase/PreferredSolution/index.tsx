import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';

import AutoSave from 'components/AutoSave';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import TextAreaField from 'components/TextAreaField';
// import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { yesNoMap } from 'data/common';
import { BusinessCaseModel, PreferredSolutionForm } from 'types/businessCase';
import { LifecycleCosts } from 'types/estimatedLifecycle';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseSchema } from 'validations/businessCaseSchema';

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
      validationSchema={BusinessCaseSchema(isFinal).preferredSolution}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<PreferredSolutionForm>) => {
        const { values, errors, setErrors, setFieldValue, validateForm } =
          formikProps;

        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            title={t('preferredSolution')}
            systemIntakeId={businessCase.systemIntakeId}
            data-testid="preferred-solution"
            errors={flatErrors}
            fieldsMandatory={isFinal}
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
                  {t('Save & return to Business Case')}
                </IconButton>

                <FieldGroup
                  scrollElement="preferredSolution.title"
                  error={!!flatErrors['preferredSolution.title']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionTitle">
                    {t('solutionTitle')}
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

                <FieldGroup
                  scrollElement="preferredSolution.acquisitionApproach"
                  error={!!flatErrors['preferredSolution.acquisitionApproach']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionAcquisitionApproach">
                    {t('solutionAcquisitionApproach')}
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

                {/* TODO: NJD add target contract award and target completion of dev work questions */}

                <FieldGroup
                  scrollElement="preferredSolution.security.isApproved"
                  error={!!flatErrors['preferredSolution.security.isApproved']}
                  data-testid="security-approval"
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label">{t('isApproved')}</legend>
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
                    scrollElement="preferredSolution.security.isBeingReviewed"
                    error={
                      !!flatErrors['preferredSolution.security.isBeingReviewed']
                    }
                    data-testid="security-approval-in-progress"
                  >
                    <fieldset className="usa-fieldset margin-top-4">
                      <legend className="usa-label margin-bottom-1">
                        {t('isBeingReviewed')}
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

                {/* TODO: NJD add zero trust principles question */}

                <FieldGroup
                  scrollElement="preferredSolution.hosting.type"
                  error={!!flatErrors['preferredSolution.hosting.type']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label">{t('hostingType')}</legend>
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

                        {/* TODO: NJD add cloud  / cloud migration strategy question */}

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
                    <legend className="usa-label">
                      {t('hasUserInterface')}
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

                {/* TODO: NJD add workforce training requirements question */}

                <hr
                  className="margin-bottom-1 margin-top-4 opacity-30"
                  aria-hidden
                />
                <>
                  <span className="font-body-sm text-bold">
                    {t('prosAndCons')}
                  </span>
                  <br />
                  <p>{t('prosAndConsHelpText')}</p>
                </>

                <FieldGroup
                  scrollElement="preferredSolution.pros"
                  error={!!flatErrors['preferredSolution.pros']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionPros">
                    {t('pros.label')}
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionProsHelp"
                    className="margin-top-1"
                  >
                    {t('pros.include')}
                    <ul className="padding-left-205 margin-top-1 margin-bottom-0">
                      <li>{t('pros.immediateImpact')}</li>
                      <li>{t('pros.downstreamImpact')}</li>
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
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionConsHelp"
                    className="margin-top-1"
                  >
                    {t('cons.include')}
                    <ul className="padding-left-205 margin-top-1 margin-bottom-0">
                      <li>{t('cons.immediateImpact')}</li>
                      <li>{t('cons.downstreamImpact')}</li>
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
                <Label htmlFor="BusinessCase-PreferredSolutionCostSavings">
                  {t('costSavings')}
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

            <ButtonGroup>
              <Button
                type="button"
                outline
                onClick={() => {
                  dispatchSave();
                  setErrors({});
                  const newUrl = 'request-description';
                  history.push(newUrl);
                }}
              >
                {t('Back')}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  validateForm().then(err => {
                    if (Object.keys(err).length === 0) {
                      dispatchSave();
                      const newUrl = 'alternative-solution-a';
                      history.push(newUrl);
                    } else {
                      window.scrollTo(0, 0);
                    }
                  });
                }}
              >
                {t('Next')}
              </Button>
            </ButtonGroup>

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
              {t('Save & return to Business Case')}
            </IconButton>

            <PageNumber currentPage={4} totalPages={5} />
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
