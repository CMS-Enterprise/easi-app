import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import EstimatedLifecycleCost from 'components/EstimatedLifecycleCost';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { yesNoMap } from 'data/common';
import { BusinessCaseModel, PreferredSolutionForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { isBusinessCaseFinal } from 'utils/systemIntake';
import {
  BusinessCaseDraftValidationSchema,
  BusinessCaseFinalValidationSchema
} from 'validations/businessCaseSchema';

type PreferredSolutionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
};
const PreferredSolution = ({
  businessCase,
  formikRef,
  dispatchSave
}: PreferredSolutionProps) => {
  const history = useHistory();
  const initialValues = {
    preferredSolution: businessCase.preferredSolution
  };

  const ValidationSchema =
    businessCase.systemIntakeStatus === 'BIZ_CASE_FINAL_NEEDED'
      ? BusinessCaseFinalValidationSchema
      : BusinessCaseDraftValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={ValidationSchema.preferredSolution}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<PreferredSolutionForm>) => {
        const {
          values,
          errors,
          setErrors,
          setFieldValue,
          validateForm
        } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <div className="grid-container" data-testid="preferred-solution">
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                classNames="margin-top-3"
                heading="Please check and fix the following"
                testId="formik-validation-errors"
              >
                {Object.keys(flatErrors).map(key => {
                  return (
                    <ErrorAlertMessage
                      key={`Error.${key}`}
                      errorKey={key}
                      message={flatErrors[key]}
                    />
                  );
                })}
              </ErrorAlert>
            )}
            <PageHeading>Alternatives Analysis</PageHeading>
            <div className="tablet:grid-col-9">
              <div className="line-height-body-6">
                Some examples of options to consider may include:
                <ul className="padding-left-205 margin-y-0">
                  <li>Buy vs. build vs. lease vs. reuse of existing system</li>
                  <li>
                    Commercial off-the-shelf (COTS) vs. Government off-the-shelf
                    (GOTS)
                  </li>
                  <li>Mainframe vs. server-based vs. clustering vs. Cloud</li>
                </ul>
                <br />
                In your options, include details such as differences between
                system capabilities, user friendliness, technical and security
                considerations, ease and timing of integration with CMS&apos; IT
                infrastructure, etc.
              </div>
            </div>
            {/* Only display "all fields are mandatory" alert if biz case in final stage */}
            {isBusinessCaseFinal(businessCase.systemIntakeStatus) && (
              <div className="tablet:grid-col-5 margin-top-2 margin-bottom-5">
                <MandatoryFieldsAlert />
              </div>
            )}
            <Form>
              <div className="tablet:grid-col-9">
                <h2>Preferred solution</h2>
                <FieldGroup
                  scrollElement="preferredSolution.title"
                  error={!!flatErrors['preferredSolution.title']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionTitle">
                    Preferred solution: Title
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.title']}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
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
                    Preferred solution: Summary
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionSummaryHelp"
                    className="margin-top-1"
                  >
                    <span>Please include:</span>
                    <ul className="padding-left-205">
                      <li>
                        a brief summary of the proposed IT solution including
                        any associated software products,
                      </li>
                      <li>
                        implementation approach (e.g. development/configuration,
                        phases),
                      </li>
                      <li>
                        costs (e.g. services, software, Operation and
                        Maintenance),{' '}
                      </li>
                      <li>and potential acquisition approaches</li>
                    </ul>
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.summary']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors['preferredSolution.summary']}
                    id="BusinessCase-PreferredSolutionSummary"
                    maxLength={2000}
                    name="preferredSolution.summary"
                    aria-describedby="BusinessCase-PreferredSolutionSummaryCounter BusinessCase-PreferredSolutionSummaryHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-PreferredSolutionSummaryCounter"
                    characterCount={
                      2000 - values.preferredSolution.summary.length
                    }
                  />
                </FieldGroup>
                <FieldGroup
                  scrollElement="preferredSolution.acquisitionApproach"
                  error={!!flatErrors['preferredSolution.acquisitionApproach']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionAcquisitionApproach">
                    Preferred solution: Acquisition approach
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionAcquisitionApproachHelp"
                    className="margin-y-1"
                  >
                    Describe the approach to acquiring the products and services
                    required to deliver the system, including potential contract
                    vehicles.
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
                    maxLength={2000}
                    name="preferredSolution.acquisitionApproach"
                    aria-describedby="BusinessCase-PreferredSolutionAcquisitionApproachCounter BusinessCase-PreferredSolutionAcquisitionApproachHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-PreferredSolutionAcquisitionApproachCounter"
                    characterCount={
                      2000 - values.preferredSolution.acquisitionApproach.length
                    }
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.security.isApproved"
                  error={!!flatErrors['preferredSolution.security.isApproved']}
                  data-testid="security-approval"
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label">
                      Is your solution approved by IT Security for use at CMS
                      (FedRAMP, FISMA approved, within the CMS cloud enclave)?
                    </legend>
                    <FieldErrorMsg>
                      {flatErrors['preferredSolution.security.isApproved']}
                    </FieldErrorMsg>
                    <Field
                      as={RadioField}
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
                      as={RadioField}
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
                        Is it in the process of CMS approval?
                      </legend>
                      <HelpText id="BusinessCase-PreferredSolutionApprovalHelp">
                        Obtaining CMS Approval can be lengthy and solutions that
                        do not have it or are just starting may lead to longer
                        project timelines.
                      </HelpText>
                      <FieldErrorMsg>
                        {
                          flatErrors[
                            'preferredSolution.security.isBeingReviewed'
                          ]
                        }
                      </FieldErrorMsg>
                      <Field
                        as={RadioField}
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
                        as={RadioField}
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
                        as={RadioField}
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
                  scrollElement="preferredSolution.hosting.type"
                  error={!!flatErrors['preferredSolution.hosting.type']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label">
                      Do you need to host your solution?
                    </legend>
                    <FieldErrorMsg>
                      {flatErrors['preferredSolution.hosting.type']}
                    </FieldErrorMsg>

                    <Field
                      as={RadioField}
                      checked={
                        values.preferredSolution.hosting.type === 'cloud'
                      }
                      id="BusinessCase-PreferredSolutionHostingCloud"
                      name="preferredSolution.hosting.type"
                      label="Yes, in the cloud (AWS, Azure, etc.)"
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
                            Where are you planning to host?
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['preferredSolution.hosting.location']}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
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
                          scrollElement="preferredSolution.hosting.cloudServiceType"
                          error={
                            !!flatErrors[
                              'preferredSolution.hosting.cloudServiceType'
                            ]
                          }
                        >
                          <Label htmlFor="BusinessCase-PreferredSolutionCloudServiceType">
                            What, if any, type of cloud service are you planning
                            to use for this solution (Iaas, PaaS, SaaS, etc.)?
                          </Label>
                          <FieldErrorMsg>
                            {
                              flatErrors[
                                'preferredSolution.hosting.cloudServiceType'
                              ]
                            }
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
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
                      as={RadioField}
                      checked={
                        values.preferredSolution.hosting.type === 'dataCenter'
                      }
                      id="BusinessCase-PreferredSolutionHostingDataCenter"
                      name="preferredSolution.hosting.type"
                      label="Yes, at a data center"
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
                          Which data center do you plan to host it at?
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors['preferredSolution.hosting.location']}
                        </FieldErrorMsg>
                        <Field
                          as={TextField}
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
                      as={RadioField}
                      checked={values.preferredSolution.hosting.type === 'none'}
                      id="BusinessCase-PreferredSolutionHostingNone"
                      name="preferredSolution.hosting.type"
                      label="No, hosting is not needed"
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
                      Will your solution have a User Interface?
                    </legend>
                    <FieldErrorMsg>
                      {flatErrors['preferredSolution.hasUserInterface']}
                    </FieldErrorMsg>

                    <Field
                      as={RadioField}
                      checked={
                        values.preferredSolution.hasUserInterface === 'YES'
                      }
                      id="BusinessCase-PreferredHasUserInferfaceYes"
                      name="preferredSolution.hasUserInterface"
                      label="Yes"
                      value="YES"
                    />
                    <Field
                      as={RadioField}
                      checked={
                        values.preferredSolution.hasUserInterface === 'NO'
                      }
                      id="BusinessCase-PreferredHasUserInferfaceNo"
                      name="preferredSolution.hasUserInterface"
                      label="No"
                      value="NO"
                    />

                    <Field
                      as={RadioField}
                      checked={
                        values.preferredSolution.hasUserInterface === 'NOT_SURE'
                      }
                      id="BusinessCase-PreferredHasUserInferfaceNotSure"
                      name="preferredSolution.hasUserInterface"
                      label="I'm not sure"
                      value="NOT_SURE"
                    />
                  </fieldset>
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.pros"
                  error={!!flatErrors['preferredSolution.pros']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionPros">
                    Preferred solution: Pros
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionProsHelp"
                    className="margin-y-1"
                  >
                    Identify any aspects of this solution that positively
                    differentiates this approach from other solutions
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.pros']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors['preferredSolution.pros']}
                    id="BusinessCase-PreferredSolutionPros"
                    maxLength={2000}
                    name="preferredSolution.pros"
                    aria-describedby="BusinessCase-PreferredSolutionProsCounter BusinessCase-PreferredSolutionProsHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-PreferredSolutionProsCounter"
                    characterCount={2000 - values.preferredSolution.pros.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="preferredSolution.cons"
                  error={!!flatErrors['preferredSolution.cons']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionCons">
                    Preferred solution: Cons
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionConsHelp"
                    className="margin-y-1"
                  >
                    Identify any aspects of this solution that negatively impact
                    this approach
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['preferredSolution.cons']}
                  </FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors['preferredSolution.cons']}
                    id="BusinessCase-PreferredSolutionCons"
                    maxLength={2000}
                    name="preferredSolution.cons"
                    aria-describedby="BusinessCase-PreferredSolutionConsCounter BusinessCase-PreferredSolutionConsHelp"
                  />
                  <CharacterCounter
                    id="BusinessCase-PreferredSolutionConsCounter"
                    characterCount={2000 - values.preferredSolution.cons.length}
                  />
                </FieldGroup>
              </div>
              <div className="tablet:grid-col-9 margin-top-2">
                <h2 className="margin-0">Estimated lifecycle cost</h2>
                <HelpText id="BusinessCase-EstimatedLifecycleCostHelp">
                  <p className="margin-y-2">
                    You can add speculative costs if exact ones are not known or
                    if a contract is not yet in place.
                  </p>
                  <span>
                    These things should be considered when estimating costs:
                  </span>
                  <ul className="padding-left-205">
                    <li>Hosting</li>
                    <li>
                      Software subscription and licenses (Commercial
                      off-the-shelf and Government off-the-shelf products)
                    </li>
                    <li>Contractor rates and salaries</li>
                    <li>Inflation</li>
                  </ul>
                </HelpText>
                <EstimatedLifecycleCost
                  formikKey="preferredSolution.estimatedLifecycleCost"
                  years={values.preferredSolution.estimatedLifecycleCost}
                  businessCaseCreatedAt={businessCase.createdAt}
                  errors={
                    errors.preferredSolution &&
                    errors.preferredSolution.estimatedLifecycleCost
                  }
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className="tablet:grid-col-9 margin-bottom-7">
                <FieldGroup
                  scrollElement="preferredSolution.costSavings"
                  error={!!flatErrors['preferredSolution.costSavings']}
                >
                  <Label htmlFor="BusinessCase-PreferredSolutionCostSavings">
                    What is the cost savings or avoidance associated with this
                    solution?
                  </Label>
                  <HelpText
                    id="BusinessCase-PreferredSolutionCostSavingsHelp"
                    className="margin-y-1"
                  >
                    This could include old systems going away, contract hours/
                    new Full Time Employees not needed, or other savings, even
                    if indirect.
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
                  <CharacterCounter
                    id="BusinessCase-PreferredSolutionCostSavingsCounter"
                    characterCount={
                      2000 - values.preferredSolution.costSavings.length
                    }
                  />
                </FieldGroup>
              </div>
            </Form>

            <Button
              type="button"
              outline
              onClick={() => {
                dispatchSave();
                setErrors({});
                const newUrl = 'as-is-solution';
                history.push(newUrl);
              }}
            >
              Back
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
              Next
            </Button>
            <div className="margin-y-3">
              <Button
                type="button"
                unstyled
                onClick={() => {
                  dispatchSave();
                  history.push(
                    `/governance-task-list/${businessCase.systemIntakeId}`
                  );
                }}
              >
                <span>
                  <i className="fa fa-angle-left" /> Save & Exit
                </span>
              </Button>
            </div>
            <PageNumber
              currentPage={4}
              totalPages={
                alternativeSolutionHasFilledFields(businessCase.alternativeB)
                  ? 6
                  : 5
              }
            />
            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />
          </div>
        );
      }}
    </Formik>
  );
};

export default PreferredSolution;
