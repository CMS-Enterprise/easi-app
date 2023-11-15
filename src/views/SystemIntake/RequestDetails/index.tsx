import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import IconButton from 'components/shared/IconButton';
import processStages from 'constants/enums/processStages';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeRequestDetails as UpdateSystemIntakeRequestDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeRequestDetails,
  UpdateSystemIntakeRequestDetailsVariables
} from 'queries/types/UpdateSystemIntakeRequestDetails';
import { SystemIntakeFormState } from 'types/graphql-global-types';
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
  const { t } = useTranslation('intake');

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
                heading={t('form:inputError.checkFix')}
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
            <PageHeading className="margin-bottom-3">
              {t('requestDetails.heading')}
            </PageHeading>

            {systemIntake.requestFormState ===
              SystemIntakeFormState.EDITS_REQUESTED && (
              <FeedbackBanner id={systemIntake.id} type="Intake Request" />
            )}

            <p className="line-height-body-6">
              {t('requestDetails.description')}
            </p>

            <MandatoryFieldsAlert className="tablet:grid-col-6" />

            <Form className="tablet:grid-col-9 margin-bottom-7">
              <FieldGroup
                scrollElement="requestName"
                error={!!flatErrors.requestName}
              >
                <Label htmlFor="IntakeForm-ContractName">
                  {t('requestDetails.contractTitle')}
                </Label>
                <HelpText
                  id="IntakeForm-ContractNameHelp"
                  className="margin-top-105"
                >
                  {t('requestDetails.contractTitleHelpText')}
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
                  {t('requestDetails.businessNeed')}
                </Label>
                <HelpText
                  id="IntakeForm-BusinessNeedHelp"
                  className="margin-top-105"
                >
                  {t('requestDetails.businessNeedHelpText')}
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
              </FieldGroup>

              <FieldGroup
                scrollElement="businessSolution"
                error={!!flatErrors.businessSolution}
              >
                <Label htmlFor="IntakeForm-BusinessSolution">
                  {t('requestDetails.businessSolution')}
                </Label>
                <HelpText
                  id="IntakeForm-BusinessSolutionHelp"
                  className="margin-y-1"
                >
                  {t('requestDetails.businessSolutionHelpText')}
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
              </FieldGroup>

              <FieldGroup
                className="margin-bottom-4"
                scrollElement="currentStage"
                error={!!flatErrors.currentStage}
              >
                <Label htmlFor="IntakeForm-CurrentStage">
                  {t('requestDetails.currentStage')}
                </Label>
                <HelpText id="IntakeForm-ProcessHelp" className="margin-y-1">
                  {t('requestDetails.currentStageHelpText')}
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
                    {t('requestDetails.needsEaSupport')}
                  </legend>
                  <HelpText id="IntakeForm-EAHelp">
                    {t('requestDetails.needsEaSupportHelpText')}
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
                      label={t('requestDetails.eaTeamHelp.label')}
                    >
                      <>
                        {t('requestDetails.eaTeamHelp.description')}
                        <ul className="margin-bottom-0">
                          <li>{t('requestDetails.eaTeamHelp.explore')}</li>
                          <li>{t('requestDetails.eaTeamHelp.discuss')}</li>
                          <li>{t('requestDetails.eaTeamHelp.give')}</li>
                          <li>{t('requestDetails.eaTeamHelp.help')}</li>
                          <li>{t('requestDetails.eaTeamHelp.model')}</li>
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
                    {t('requestDetails.hasUiChanges')}
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
                {t('Back')}
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
                {t('Next')}
              </Button>
              <IconButton
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
                className="margin-y-3"
                icon={<IconNavigateBefore className="margin-right-0" />}
                iconPosition="before"
              >
                {t('Save & Exit')}
              </IconButton>
            </Form>
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
