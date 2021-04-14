import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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
  const { t } = useTranslation('intake');
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
      link = `/governance-task-list/${systemIntake.id}`;
    }
    return link;
  })();

  const businessNeedExampleList: string[] = t(
    'requestDetailsForm.businessNeed.examples',
    { returnObjects: true }
  );

  const enterpriseArchitectureHelpList: string[] = t(
    'requestDetailsForm.enterpriseArchitecture.helpIncludes',
    { returnObjects: true }
  );

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
            <PageHeading>{t('requestDetailsForm.heading')}</PageHeading>
            <p className="line-height-body-6">
              {t('requestDetailsForm.description')}
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
                  <Label htmlFor="IntakeForm-RequestName">
                    {t('csvHeadings.projectName')}
                  </Label>
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
                    {t('requestDetailsForm.businessNeed.whatIsIt')}
                  </Label>
                  <HelpText
                    id="IntakeForm-BusinessNeedHelp"
                    className="margin-top-105"
                  >
                    <>
                      <span>
                        {t('requestDetailsForm.businessNeed.include')}
                      </span>
                      <ul className="margin-top-1 padding-left-205">
                        {businessNeedExampleList.map(k => (
                          <li key={k}>{k}</li>
                        ))}
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
                    {t('requestDetailsForm.businessNeed.howWillYouSolveIt')}
                  </Label>
                  <HelpText
                    id="IntakeForm-BusinessSolutionHelp"
                    className="margin-y-1"
                  >
                    {t('requestDetailsForm.businessNeed.solution')}
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
                  <fieldset className="usa-fieldset margin-top-4">
                    <legend className="usa-label margin-bottom-1">
                      {t(
                        'requestDetailsForm.enterpriseArchitecture.needSupport'
                      )}
                    </legend>
                    <HelpText
                      id="IntakeForm-EAHelp"
                      className="margin-bottom-1"
                    >
                      {t('requestDetailsForm.enterpriseArchitecture.unsure')}
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

                    <CollapsableLink
                      id="SystemIntake-WhatsEA"
                      label={t(
                        'requestDetailsForm.enterpriseArchitecture.howCanTheyHelp'
                      )}
                    >
                      <>
                        {t(
                          'requestDetailsForm.enterpriseArchitecture.howWillTheyHelp'
                        )}
                        <ul className="margin-bottom-0">
                          {enterpriseArchitectureHelpList.map(k => (
                            <li key={k}>{k}</li>
                          ))}
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
