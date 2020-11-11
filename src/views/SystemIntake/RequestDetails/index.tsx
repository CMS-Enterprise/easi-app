import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { RadioField } from 'components/shared/RadioField';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import { useFlags } from 'contexts/flagContext';
import { SystemIntakeForm } from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

type RequestDetailsForm = {
  requestName: string;
  fundingSource: {
    isFunded: boolean | null;
    fundingNumber: string;
  };
  businessNeed: string;
  businessSolution: string;
  needsEaSupport: boolean | null;
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
  const flags = useFlags();
  const history = useHistory();
  const initialValues: RequestDetailsForm = {
    requestName: systemIntake.requestName,
    fundingSource: systemIntake.fundingSource,
    businessNeed: systemIntake.businessNeed,
    businessSolution: systemIntake.businessSolution,
    needsEaSupport: systemIntake.needsEaSupport
  };

  const saveExitLink = (() => {
    let link = '';
    if (systemIntake.requestType === 'SHUTDOWN') {
      link = '/';
    } else {
      link = flags.taskListLite
        ? `/governance-task-list/${systemIntake.id}`
        : '/';
    }
    return link;
  })();

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
                  <Label htmlFor="IntakeForm-RequestName">Project Name</Label>
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
                  className="margin-bottom-4"
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

                <Button
                  type="button"
                  outline
                  onClick={() => {
                    dispatchSave();
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
                        const newUrl = 'contract-details';
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
                      history.push(saveExitLink);
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
            <PageNumber currentPage={2} totalPages={3} />
          </>
        );
      }}
    </Formik>
  );
};

export default RequestDetails;
