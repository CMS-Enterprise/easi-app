import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid, Icon, Label, TextInput } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import CedarContactSelect from 'components/CedarContactSelect';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { BusinessCaseModel, GeneralRequestInfoForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseSchema } from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

type GeneralRequestInfoProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};

const GeneralRequestInfo = ({
  formikRef,
  businessCase,
  dispatchSave,
  isFinal
}: GeneralRequestInfoProps) => {
  const { t } = useTranslation('businessCase');
  const history = useHistory();

  const initialValues: GeneralRequestInfoForm = {
    requestName: businessCase.requestName,
    projectAcronym: businessCase.projectAcronym,
    requester: businessCase.requester,
    businessOwner: businessCase.businessOwner
  };

  const allowedPhoneNumberCharacters = /[\d- ]+/g;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseSchema(isFinal).generalRequestInfo}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<GeneralRequestInfoForm>) => {
        const { errors, values, setFieldValue, validateForm } = formikProps;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('generalRequest')}
            description={t('generalRequestDescription')}
            errors={flatErrors}
            data-testid="general-request-info"
          >
            <Form className="tablet:grid-col-9 margin-bottom-6">
              {/* Required fields help text and alert */}
              <HelpText className="margin-top-1 text-base">
                <Trans
                  i18nKey="businessCase:requiredFields"
                  components={{ red: <span className="text-red" /> }}
                />
              </HelpText>

              {!isFinal && (
                <Alert
                  type="info"
                  className="margin-top-2"
                  data-testid="draft-business-case-fields-alert"
                  slim
                >
                  {t('businessCase:draftAlert')}
                </Alert>
              )}

              <Grid row gap="sm">
                <Grid tablet={{ col: 7 }}>
                  <FieldGroup
                    scrollElement="requestName"
                    error={!!flatErrors.requestName}
                  >
                    <Label htmlFor="BusinessCase-RequestName">
                      {t('requestName')}
                      <RequiredAsterisk />
                    </Label>
                    <HelpText
                      id="BusinessCase-RequestNameHelp"
                      className="tablet:width-mobile-lg"
                    >
                      {t('requestNameHelpText')}
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                    <Field
                      as={TextInput}
                      error={!!flatErrors.requestName}
                      id="BusinessCase-RequestName"
                      maxLength={50}
                      aria-describedby="BusinessCase-RequestNameHelp"
                      name="requestName"
                    />
                  </FieldGroup>
                </Grid>

                <Grid tablet={{ col: 5 }}>
                  <FieldGroup
                    scrollElement="projectAcronym"
                    className="margin-left-1"
                    error={!!flatErrors.projectAcronym}
                  >
                    <Label htmlFor="BusinessCase-ProjectAcronym">
                      {t('projectAcronym')}
                    </Label>
                    <HelpText id="BusinessCase-ProjectAcronymHelp">
                      {t('projectAcronymHelpText')}
                    </HelpText>
                    <FieldErrorMsg>{flatErrors.projectAcronym}</FieldErrorMsg>
                    <Field
                      as={TextInput}
                      error={!!flatErrors.projectAcronym}
                      id="BusinessCase-ProjectAcronym"
                      maxLength={10}
                      aria-describedby="BusinessCase-ProjectAcronymHelp"
                      name="projectAcronym"
                    />
                  </FieldGroup>
                </Grid>
              </Grid>

              <FieldGroup
                scrollElement="requester.name"
                error={!!flatErrors['requester.name']}
              >
                <Label htmlFor="BusinessCase-RequesterName">
                  {t('requester')}
                  <RequiredAsterisk />
                </Label>
                <FieldErrorMsg>{flatErrors['requester.name']}</FieldErrorMsg>
                <Field
                  as={TextInput}
                  error={!!flatErrors['requester.name']}
                  id="BusinessCase-RequesterName"
                  maxLength={50}
                  name="requester.name"
                  className="maxw-none"
                  disabled
                />
              </FieldGroup>
              <FieldGroup
                scrollElement="businessOwner.name"
                error={!!flatErrors['businessOwner.name']}
              >
                <Label htmlFor="BusinessCase-BusinessOwnerName">
                  {t('businessOwner')}
                  <RequiredAsterisk />
                </Label>
                <FieldErrorMsg>
                  {flatErrors['businessOwner.name']}
                </FieldErrorMsg>
                <Field
                  as={CedarContactSelect}
                  name="businessOwner.name"
                  error={!!flatErrors['businessOwner.name']}
                  id="BusinessCase-BusinessOwnerName"
                  value={{
                    commonName: values.businessOwner.name,
                    euaUserId: '',
                    email: ''
                  }}
                  onChange={(contact: any) => {
                    setFieldValue(
                      'businessOwner.name',
                      contact?.commonName || ''
                    );
                  }}
                />
              </FieldGroup>
              <FieldGroup
                scrollElement="requester.phoneNumber"
                error={!!flatErrors['requester.phoneNumber']}
              >
                <Label htmlFor="BusinessCase-RequesterPhoneNumber">
                  {t('requesterPhoneNumber')}
                  <RequiredAsterisk />
                </Label>
                <HelpText id="BusinessCase-PhoneNumber">
                  {t('requesterPhoneNumberHelpText')}
                </HelpText>
                <FieldErrorMsg>
                  {flatErrors['requester.phoneNumber']}
                </FieldErrorMsg>
                <Field
                  as={TextInput}
                  error={!!flatErrors['requester.phoneNumber']}
                  id="BusinessCase-RequesterPhoneNumber"
                  maxLength={20}
                  name="requester.phoneNumber"
                  match={allowedPhoneNumberCharacters}
                  aria-describedby="BusinessCase-PhoneNumber"
                  className="maxw-none"
                />
              </FieldGroup>
            </Form>

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
              {t('Next')}
            </Button>

            <IconButton
              icon={<Icon.ArrowBack />}
              type="button"
              unstyled
              onClick={() => {
                dispatchSave();
                history.push(
                  `/governance-task-list/${businessCase.systemIntakeId}`
                );
              }}
              className="margin-bottom-3 margin-top-205"
            >
              {t('saveAndExit')}
            </IconButton>

            <PageNumber currentPage={1} totalPages={4} />

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
