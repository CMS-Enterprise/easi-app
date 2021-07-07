import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel, GeneralRequestInfoForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { isBusinessCaseFinal } from 'utils/systemIntake';
import {
  BusinessCaseDraftValidationSchema,
  BusinessCaseFinalValidationSchema
} from 'validations/businessCaseSchema';

type GeneralRequestInfoProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
};
const GeneralRequestInfo = ({
  formikRef,
  businessCase,
  dispatchSave
}: GeneralRequestInfoProps) => {
  const history = useHistory();
  const initialValues: GeneralRequestInfoForm = {
    requestName: businessCase.requestName,
    requester: businessCase.requester,
    businessOwner: businessCase.businessOwner
  };
  const allowedPhoneNumberCharacters = /[\d- ]+/g;

  const ValidationSchema =
    businessCase.systemIntakeStatus === 'BIZ_CASE_FINAL_NEEDED'
      ? BusinessCaseFinalValidationSchema
      : BusinessCaseDraftValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={ValidationSchema.generalRequestInfo}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<GeneralRequestInfoForm>) => {
        const { errors, values, validateForm } = formikProps;
        const flatErrors = flattenErrors(errors);
        return (
          <div className="grid-container">
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
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
            <PageHeading>General request information</PageHeading>
            <p className="line-height-body-6">
              Make a first draft of the various solutions you’ve thought of and
              the costs involved to build or buy them. Once you have a draft
              business case ready for review, send it to the Governance Review
              Admin Team who will ensure it is ready to be presented at the
              Governance Review Team (GRT) Meeting.
            </p>
            {/* Only display "all fields are mandatory" alert if biz case in final stage */}
            {isBusinessCaseFinal(businessCase.systemIntakeStatus) && (
              <div className="tablet:grid-col-5">
                <MandatoryFieldsAlert />
              </div>
            )}
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup
                  scrollElement="requestName"
                  error={!!flatErrors.requestName}
                >
                  <Label htmlFor="BusinessCase-RequestName">Project Name</Label>
                  <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors.requestName}
                    id="BusinessCase-RequestName"
                    maxLength={50}
                    name="requestName"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="requester.name"
                  error={!!flatErrors['requester.name']}
                >
                  <Label htmlFor="BusinessCase-RequesterName">Requester</Label>
                  <FieldErrorMsg>{flatErrors['requester.name']}</FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors['requester.name']}
                    id="BusinessCase-RequesterName"
                    maxLength={50}
                    name="requester.name"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="businessOwner.name"
                  error={!!flatErrors['businessOwner.name']}
                >
                  <Label htmlFor="BusinessCase-BusinessOwnerName">
                    Business Owner
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['businessOwner.name']}
                  </FieldErrorMsg>
                  <Field
                    as={TextField}
                    error={!!flatErrors['businessOwner.name']}
                    id="BusinessCase-BusinessOwnerName"
                    maxLength={50}
                    name="businessOwner.name"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="requester.phoneNumber"
                  error={!!flatErrors['requester.phoneNumber']}
                >
                  <Label htmlFor="BusinessCase-RequesterPhoneNumber">
                    Requester Phone Number
                  </Label>
                  <HelpText id="BusinessCase-PhoneNumber">
                    For example 123456789 or 123-456-789
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['requester.phoneNumber']}
                  </FieldErrorMsg>
                  <div className="width-card-lg">
                    <Field
                      as={TextField}
                      error={!!flatErrors['requester.phoneNumber']}
                      id="BusinessCase-RequesterPhoneNumber"
                      maxLength={20}
                      name="requester.phoneNumber"
                      match={allowedPhoneNumberCharacters}
                      aria-describedby="BusinessCase-PhoneNumber"
                    />
                  </div>
                </FieldGroup>
              </Form>
            </div>
            <Button
              type="button"
              onClick={() => {
                validateForm().then(err => {
                  if (Object.keys(err).length === 0) {
                    dispatchSave();
                    const newUrl = 'request-description';
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
              currentPage={1}
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

export default GeneralRequestInfo;
