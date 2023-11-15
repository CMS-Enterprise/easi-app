import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  IconNavigateBefore,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import { alternativeSolutionHasFilledFields } from 'data/businessCase';
import { BusinessCaseModel, GeneralRequestInfoForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { isBusinessCaseFinal } from 'utils/systemIntake';
import {
  BusinessCaseDraftValidationSchema,
  BusinessCaseFinalValidationSchema
} from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

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
  const { t } = useTranslation('businessCase');
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
          <BusinessCaseStepWrapper
            id={businessCase.id || ''}
            title={t('generalRequest')}
            description={t('generalRequestDescription')}
            errors={flatErrors}
            data-testid="general-request-info"
            // TODO EASI-3440: Update to use v2 status
            fieldsMandatory={isBusinessCaseFinal(
              businessCase.systemIntakeStatus
            )}
          >
            <div className="tablet:grid-col-9 margin-bottom-7">
              <Form>
                <FieldGroup
                  scrollElement="requestName"
                  error={!!flatErrors.requestName}
                >
                  <Label htmlFor="BusinessCase-RequestName">Project Name</Label>
                  <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                  <Field
                    as={TextInput}
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
                    as={TextInput}
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
                    as={TextInput}
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
                    For example 1234567890 or 123-456-7890
                  </HelpText>
                  <FieldErrorMsg>
                    {flatErrors['requester.phoneNumber']}
                  </FieldErrorMsg>
                  <div className="width-card-lg">
                    <Field
                      as={TextInput}
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
                <span className="display-flex flex-align-center">
                  <IconNavigateBefore /> Save & Exit
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
          </BusinessCaseStepWrapper>
        );
      }}
    </Formik>
  );
};

export default GeneralRequestInfo;
