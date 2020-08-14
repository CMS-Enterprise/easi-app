import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Formik, Field, FormikProps, Form } from 'formik';
import { RadioField } from 'components/shared/RadioField';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import TextAreaField from 'components/shared/TextAreaField';
import processStages from 'constants/enums/processStages';
import CollapsableLink from 'components/shared/CollapsableLink';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import CharacterCounter from 'components/CharacterCounter';
import flattenErrors from 'utils/flattenErrors';
import { Button } from '@trussworks/react-uswds';

import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import PageNumber from 'components/PageNumber';
import { SystemIntakeForm } from 'types/systemIntake';

type RequestDetailsForm = {
  requestName: string;
  fundingSource: {
    isFunded: boolean | null;
    fundingNumber: string;
  };
  businessNeed: string;
  businessSolution: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  hasContract: string;
};

type RequestDetailsProps = {
  formikRef: any;
  systemIntake: SystemIntakeForm;
  dispatchSave: () => void;
};

const RequestDetails = ({
  formikRef,
  systemIntake,
  dispatchSave
}: RequestDetailsProps) => {
  const history = useHistory();
  const { systemId } = useParams();

  const initialValues: RequestDetailsForm = {
    requestName: systemIntake.requestName,
    fundingSource: systemIntake.fundingSource,
    businessNeed: systemIntake.businessNeed,
    businessSolution: systemIntake.businessSolution,
    currentStage: systemIntake.currentStage,
    needsEaSupport: systemIntake.needsEaSupport,
    hasContract: systemIntake.hasContract
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={SystemIntakeValidationSchema.requestDetails}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<RequestDetailsForm>) => {
        const { values, errors, setFieldValue } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="system-intake-errors"
                classNames="margin-top-3"
                heading="Please check and fix the following"
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
            <h1 className="font-heading-xl margin-top-4">Request details</h1>
            <p className="line-height-body-6">
              Provide a detailed explanation of the business need/issue/problem
              that the requested project will address, including any legislative
              mandates, regulations, etc. Include any expected benefits from the
              investment of organizational resources into this project. Please
              be sure to indicate clearly any/all relevant deadlines (e.g.,
              statutory deadlines that CMS must meet). Explain the benefits of
              developing an IT solution for this need.
            </p>
            <div className="tablet:grid-col-9 margin-bottom-7">
              <div className="tablet:grid-col-6">
                <MandatoryFieldsAlert />
              </div>
              <Form>
                <FieldGroup
                  scrollElement="requestName"
                  error={!!flatErrors.requestName}
                >
                  <Label htmlFor="IntakeForm-RequestName">Request Name</Label>
                  <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors.requestName}
                    id="IntakeForm-RequestName"
                    maxLength={50}
                    name="requestName"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="businessNeed"
                  error={!!flatErrors.businessNeed}
                >
                  <Label htmlFor="IntakeForm-BusinessNeed">
                    What is your business need?
                  </Label>
                  <HelpText className="margin-top-105">
                    <>
                      <span>Include:</span>
                      <ul className="margin-top-1 padding-left-205">
                        <li>
                          a detailed explanation of the business
                          need/issue/problem that the request will address
                        </li>
                        <li>
                          any legislative mandates or regulations that needs to
                          be met
                        </li>
                        <li>
                          any expected benefits from the investment of
                          organizational resources into the request
                        </li>
                        <li>
                          relevant deadlines (e.g., statutory deadlines that CMS
                          must meet)
                        </li>
                        <li>
                          and the benefits of developing an IT solution for this
                          need.
                        </li>
                      </ul>
                    </>
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.businessNeed}
                    id="IntakeForm-BusinessNeed"
                    maxLength={2000}
                    name="businessNeed"
                    aria-describedby="IntakeForm-BusinessNeedCounter"
                  />
                  <CharacterCounter
                    id="IntakeForm-BusinessNeedCounter"
                    characterCount={2000 - values.businessNeed.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="businessSolution"
                  error={!!flatErrors.businessSolution}
                >
                  <Label htmlFor="IntakeForm-BusinessSolution">
                    How are you thinking of solving it?
                  </Label>
                  <HelpText className="margin-y-1">
                    Let us know if you have a solution in mind
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.businessSolution}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.businessSolution}
                    id="IntakeForm-BusinessSolution"
                    maxLength={2000}
                    name="businessSolution"
                    aria-describedby="IntakeForm-BusinessSolutionCounter"
                  />
                  <CharacterCounter
                    id="IntakeForm-BusinessSolutionCounter"
                    characterCount={2000 - values.businessSolution.length}
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="needsEaSupport"
                  error={!!flatErrors.needsEaSupport}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      Does your request need Enterprise Architecture support?
                    </legend>
                    <HelpText className="margin-bottom-1">
                      If you are unsure, mark &quot;Yes&quot; and someone from
                      the EA team will assess your needs.
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.needsEaSupport}</FieldErrorMsg>
                    <Field
                      as={RadioField}
                      checked={values.needsEaSupport === true}
                      id="IntakeForm-NeedsEaSupportYes"
                      name="needsEaSupport"
                      label="Yes"
                      onChange={() => {
                        setFieldValue('needsEaSupport', true);
                      }}
                      value
                    />

                    <Field
                      as={RadioField}
                      checked={values.needsEaSupport === false}
                      id="IntakeForm-NeedsEaSupportNo"
                      name="needsEaSupport"
                      label="No"
                      onChange={() => {
                        setFieldValue('needsEaSupport', false);
                      }}
                      value={false}
                    />

                    <CollapsableLink
                      id="SystemIntake-WhatsEA"
                      label="How can the Enterprise Architecture team help me?"
                    >
                      <>
                        CMS&apos; Enterprise Architecture (EA) function will
                        help you build your Business Case by addressing the
                        following:
                        <ul className="margin-bottom-0">
                          <li>
                            Explore business solutions that might exist
                            elsewhere within CMS
                          </li>
                          <li>Discuss lessons learned from similar projects</li>
                          <li>
                            Give you and your team an enterprise-level view of
                            the agency to avoid duplication of projects
                          </li>
                          <li>
                            Help you explore alternatives you might not have
                            thought of
                          </li>
                          <li>
                            Model your business processes and document workflows
                          </li>
                        </ul>
                      </>
                    </CollapsableLink>
                  </fieldset>
                </FieldGroup>

                <FieldGroup
                  scrollElement="currentStage"
                  error={!!flatErrors.currentStage}
                >
                  <Label htmlFor="IntakeForm-CurrentStage">
                    Where are you in the process?
                  </Label>
                  <HelpText className="margin-y-1">
                    This helps the governance team provide the right type of
                    guidance for your request
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.CurrentStage}</FieldErrorMsg>
                  <Field
                    as={DropdownField}
                    error={!!flatErrors.currentStage}
                    id="IntakeForm-CurrentStage"
                    name="currentStage"
                  >
                    <Field
                      as={DropdownItem}
                      name="Select an option"
                      value=""
                      disabled
                    />
                    {processStages.map(stage => (
                      <Field
                        as={DropdownItem}
                        key={`ProcessStageComponent-${stage.value}`}
                        name={stage.name}
                        value={stage.name}
                      />
                    ))}
                  </Field>
                </FieldGroup>

                <FieldGroup
                  scrollElement="hasContract"
                  error={!!flatErrors.hasContract}
                >
                  <Label htmlFor="IntakeForm-HasContract">
                    Do you already have a contract in place to support this
                    effort?
                  </Label>
                  <HelpText className="margin-y-1">
                    This information helps the Office of Acquisition and Grants
                    Management (OAGM) track current work
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.hasContract}</FieldErrorMsg>
                  <Field
                    as={DropdownField}
                    error={!!flatErrors.hasContract}
                    id="IntakeForm-HasContract"
                    helpText="This information helps the Office of Acquisition and Grants Management (OAGM) track work"
                    name="hasContract"
                  >
                    <Field
                      as={DropdownItem}
                      name="Select an option"
                      value=""
                      disabled
                    />
                    <Field
                      as={DropdownItem}
                      key="HasContract-Yes"
                      name="Yes"
                      value="Yes"
                    />
                    <Field
                      as={DropdownItem}
                      key="HasContract-No"
                      name="No"
                      value="No"
                    />
                    <Field
                      as={DropdownItem}
                      key="HasContract-StatementOfWork"
                      name="No, but I have a Statement of Work/Objectives"
                      value="No, but I have a Statement of Work/Objectives"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup
                  scrollElement="fundingSource.isFunded"
                  error={!!flatErrors['fundingSource.isFunded']}
                >
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      Does this request have funding from an existing funding
                      source?
                    </legend>
                    <HelpText className="margin-bottom-1">
                      If you are unsure, please get in touch with your
                      Contracting Officer Representative
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors['fundingSource.isFunded']}
                    </FieldErrorMsg>
                    <Field
                      as={RadioField}
                      checked={values.fundingSource.isFunded === true}
                      id="IntakeForm-HasFundingSourceYes"
                      name="fundingSource.isFunded"
                      label="Yes"
                      onChange={() => {
                        setFieldValue('fundingSource.isFunded', true);
                      }}
                      value
                    />
                    {values.fundingSource.isFunded && (
                      <div className="width-card margin-top-neg-2 margin-left-3 margin-bottom-1">
                        <FieldGroup
                          scrollElement="fundingSource.fundingNumber"
                          error={!!flatErrors['fundingSource.fundingNumber']}
                        >
                          <Label htmlFor="IntakeForm-FundingNumber">
                            Funding Number
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['fundingSource.fundingNumber']}
                          </FieldErrorMsg>
                          <Field
                            as={TextField}
                            error={!!flatErrors['fundingSource.fundingNumber']}
                            id="IntakeForm-FundingNumber"
                            maxLength={6}
                            name="fundingSource.fundingNumber"
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={RadioField}
                      checked={values.fundingSource.isFunded === false}
                      id="IntakeForm-HasFundingSourceNo"
                      name="fundingSource.isFunded"
                      label="No"
                      onChange={() => {
                        setFieldValue('fundingSource.isFunded', false);
                        setFieldValue('fundingSource.fundingNumber', '');
                      }}
                      value={false}
                    />
                  </fieldset>
                </FieldGroup>
                <Button
                  type="button"
                  outline
                  onClick={() => {
                    formikProps.setErrors({});
                    const newUrl = 'contact-details';
                    history.push(newUrl);
                    window.scrollTo(0, 0);
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    formikProps.validateForm().then(err => {
                      if (Object.keys(err).length === 0) {
                        dispatchSave();
                        const newUrl = 'review';
                        history.push(newUrl);
                      }
                      window.scrollTo(0, 0);
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
                      history.push(`/governance-task-list/${systemId}`);
                    }}
                  >
                    <span>
                      <i className="fa fa-angle-left" /> Save & Exit
                    </span>
                  </Button>
                </div>
              </Form>
            </div>
            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 30}
            />
            <PageNumber currentPage={2} totalPages={2} />
          </>
        );
      }}
    </Formik>
  );
};

export default RequestDetails;
