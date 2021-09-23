import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import CharacterCounter from 'components/CharacterCounter';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
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
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeRequestDetails as UpdateSystemIntakeRequestDetailsQuery } from 'queries/SystemIntakeQueries';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import {
  UpdateSystemIntakeRequestDetails,
  UpdateSystemIntakeRequestDetailsVariables
} from 'queries/types/UpdateSystemIntakeRequestDetails';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

type RequestDetailsForm = {
  requestName: string;
  businessNeed: string;
  businessSolution: string;
  needsEaSupport: boolean | null;
};

type RequestDetailsProps = {
  systemIntake: SystemIntake;
};

const RequestDetails = ({ systemIntake }: RequestDetailsProps) => {
  const {
    id,
    requestName,
    businessNeed,
    businessSolution,
    needsEaSupport
  } = systemIntake;
  const formikRef = useRef<FormikProps<RequestDetailsForm>>(null);
  const history = useHistory();

  const initialValues: RequestDetailsForm = {
    requestName: requestName || '',
    businessNeed: businessNeed || '',
    businessSolution: businessSolution || '',
    needsEaSupport
  };

  const [mutate] = useMutation<
    UpdateSystemIntakeRequestDetails,
    UpdateSystemIntakeRequestDetailsVariables
  >(UpdateSystemIntakeRequestDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id
        }
      }
    ]
  });

  const onSubmit = (values?: RequestDetailsForm) => {
    if (values)
      mutate({
        variables: {
          input: { id, ...values }
        }
      });
  };

  const saveExitLink = (() => {
    let link = '';
    if (systemIntake.requestType === 'SHUTDOWN') {
      link = '/';
    } else {
      link = `/governance-task-list/${systemIntake.id}`;
    }
    return link;
  })();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
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
                testId="request-details-errors"
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
            <PageHeading>Request details</PageHeading>
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
                  <HelpText
                    id="IntakeForm-BusinessNeedHelp"
                    className="margin-top-105"
                  >
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
                    aria-describedby="IntakeForm-BusinessNeedCounter IntakeForm-BusinessNeedHelp"
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
                  <HelpText
                    id="IntakeForm-BusinessSolutionHelp"
                    className="margin-y-1"
                  >
                    Let us know if you have a solution in mind
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.businessSolution}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    error={!!flatErrors.businessSolution}
                    id="IntakeForm-BusinessSolution"
                    maxLength={2000}
                    name="businessSolution"
                    aria-describedby="IntakeForm-BusinessSolutionCounter IntakeForm-BusinessSolutionHelp"
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
                  <fieldset
                    className="usa-fieldset margin-top-4"
                    data-testid="ea-support"
                  >
                    <legend className="usa-label margin-bottom-1">
                      Does your request need Enterprise Architecture support?
                    </legend>
                    <HelpText id="IntakeForm-EAHelp">
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
                      aria-describedby="IntakeForm-EAHelp"
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
                    <div className="margin-top-105">
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
                            <li>
                              Discuss lessons learned from similar projects
                            </li>
                            <li>
                              Give you and your team an enterprise-level view of
                              the agency to avoid duplication of projects
                            </li>
                            <li>
                              Help you explore alternatives you might not have
                              thought of
                            </li>
                            <li>
                              Model your business processes and document
                              workflows
                            </li>
                          </ul>
                        </>
                      </CollapsableLink>
                    </div>
                  </fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  outline
                  onClick={() => {
                    formikProps.setErrors({});
                    mutate({
                      variables: {
                        input: { id, ...values }
                      }
                    }).then(response => {
                      if (!response.errors) {
                        const newUrl = 'contact-details';
                        history.push(newUrl);
                      }
                    });
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    formikProps.validateForm().then(err => {
                      if (Object.keys(err).length === 0) {
                        mutate({
                          variables: {
                            input: { id, ...values }
                          }
                        }).then(response => {
                          if (!response.errors) {
                            const newUrl = 'contract-details';
                            history.push(newUrl);
                          }
                        });
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
                      mutate({
                        variables: {
                          input: { id, ...values }
                        }
                      }).then(response => {
                        if (!response.errors) {
                          history.push(saveExitLink);
                        }
                      });
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
              onSave={() => {
                onSubmit(formikRef?.current?.values);
              }}
              debounceDelay={3000}
            />
            <PageNumber currentPage={2} totalPages={3} />
          </>
        );
      }}
    </Formik>
  );
};

export default RequestDetails;
