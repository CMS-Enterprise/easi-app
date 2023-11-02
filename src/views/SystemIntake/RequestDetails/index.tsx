import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Dropdown,
  IconNavigateBefore,
  Label,
  Radio,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
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
import processStages from 'constants/enums/processStages';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeRequestDetails as UpdateSystemIntakeRequestDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
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
  currentStage: string;
  needsEaSupport: boolean | null;
  hasUiChanges: boolean | null;
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
    currentStage,
    needsEaSupport,
    hasUiChanges
  } = systemIntake;
  const formikRef = useRef<FormikProps<RequestDetailsForm>>(null);
  const history = useHistory();

  const initialValues: RequestDetailsForm = {
    requestName: requestName || '',
    businessNeed: businessNeed || '',
    businessSolution: businessSolution || '',
    currentStage: currentStage || '',
    needsEaSupport,
    hasUiChanges
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
              Provide a brief explanation of the business need/issue/problem
              that the contract/request will address, including your current
              plans for how to address the need. This page should speak to what
              your contract/request accomplishes and how.
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
                  <Label htmlFor="IntakeForm-ContractName">
                    Contract/Request Title
                  </Label>
                  <HelpText
                    id="IntakeForm-ContractNameHelp"
                    className="margin-top-105"
                  >
                    Your request title should match the title of your
                    Acquisition Plan or Interagency Agreement.
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors.requestName}
                    id="IntakeForm-ContractName"
                    maxLength={200}
                    name="requestName"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="businessNeed"
                  error={!!flatErrors.businessNeed}
                >
                  <Label htmlFor="IntakeForm-BusinessNeed">
                    What is your business need that this contract/request will
                    meet?
                  </Label>
                  <HelpText
                    id="IntakeForm-BusinessNeedHelp"
                    className="margin-top-105"
                  >
                    Include an explanation of the business need/issue/problem
                    that the contract/request will address. This information can
                    be pulled from your draft Acquisition Plan (Statement of
                    Need section) and/or taken from the Statement of Work,
                    Statement of Objectives or Performance Work Statement.
                    Please be brief.
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
                  <Field
                    as={Textarea}
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
                    Let us know if you have a solution in mind. This information
                    can be pulled from your draft Acquisition Plan (Capability
                    or Performance section) and/or taken from the Statement of
                    Work, Statement of Objectives or Performance Work Statement.
                    Please be brief.
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.businessSolution}</FieldErrorMsg>
                  <Field
                    as={Textarea}
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
                  scrollElement="currentStage"
                  error={!!flatErrors.currentStage}
                >
                  <Label htmlFor="IntakeForm-CurrentStage">
                    Where are you in the process?
                  </Label>
                  <HelpText id="IntakeForm-ProcessHelp" className="margin-y-1">
                    This helps the governance team provide the right type of
                    guidance for your request
                  </HelpText>
                  <FieldErrorMsg>{flatErrors.CurrentStage}</FieldErrorMsg>
                  <Field
                    as={Dropdown}
                    id="IntakeForm-CurrentStage"
                    name="currentStage"
                    aria-describedby="IntakeForm-ProcessHelp"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {processStages.map(stage => {
                      const { name, value } = stage;
                      return (
                        <option
                          key={`ProcessStageComponent-${value}`}
                          value={name}
                        >
                          {name}
                        </option>
                      );
                    })}
                  </Field>
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
                      as={Radio}
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
                      as={Radio}
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

                <FieldGroup
                  className="margin-bottom-4"
                  scrollElement="hasUiChanges"
                  error={!!flatErrors.hasUiChanges}
                >
                  <fieldset
                    className="usa-fieldset margin-top-4"
                    data-testid="has-ui-changes"
                  >
                    <legend className="usa-label margin-bottom-1">
                      Does your project involve any user interface component, or
                      changes to an interface component?
                    </legend>
                    <FieldErrorMsg>{flatErrors.hasUiChanges}</FieldErrorMsg>
                    <Field
                      as={Radio}
                      checked={values.hasUiChanges === true}
                      id="IntakeForm-HasUiChangesYes"
                      name="hasUiChanges"
                      label="Yes"
                      onChange={() => {
                        setFieldValue('hasUiChanges', true);
                      }}
                      value
                      aria-describedby="IntakeForm-HasUiChanges"
                    />

                    <Field
                      as={Radio}
                      checked={values.hasUiChanges === false}
                      id="IntakeForm-HasUiChangesNo"
                      name="hasUiChanges"
                      label="No"
                      onChange={() => {
                        setFieldValue('hasUiChanges', false);
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
                    <span className="display-flex flex-align-center">
                      <IconNavigateBefore /> Save & Exit
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
            <PageNumber currentPage={2} totalPages={5} />
          </>
        );
      }}
    </Formik>
  );
};

export default RequestDetails;
