/* eslint-disable react/prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import {
  Field as FormikField,
  Form as FormikForm,
  Formik,
  FormikProps
} from 'formik';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import PlainInfo from 'components/PlainInfo';
// import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextField from 'components/shared/TextField';
import { initialAccessibilityRequestFormData } from 'data/accessibility';
import { AccessibilityRequestForm } from 'types/accessibility';
// import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import flattenErrors from 'utils/flattenErrors';
import accessibilitySchema from 'validations/accessibilitySchema';

const Create = () => {
  const { t } = useTranslation('accessibility');

  // return (
  //   <div className="margin-left-3">
  //     <MutationForm
  //       mutation={CreateAccessibilityRequestQuery}
  //       schema={CreateAccessibilityRequestFormSchema}
  //     >
  //       <MutationField name="name" label="Name" />
  //     </MutationForm>
  //   </div>
  // );
  return (
    <PageWrapper>
      <Header />
      <MainContent className="margin-bottom-5">
        <SecondaryNav>
          <NavLink to="/508/requests/new">
            {t('tabs.accessibilityRequests')}
          </NavLink>
        </SecondaryNav>
        <div className="grid-container">
          {/* TODO: Use PageHeading component */}
          <h1 className="margin-top-6 margin-bottom-5">Add a new request</h1>
          <Formik
            initialValues={initialAccessibilityRequestFormData}
            onSubmit={values => {
              console.log('submitting', values);
            }}
            validationSchema={accessibilitySchema.requestForm}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<AccessibilityRequestForm>) => {
              const { errors } = formikProps;
              const flatErrors = flattenErrors(errors);
              return (
                <div className="margin-bottom-7">
                  <FormikForm>
                    <FieldGroup scrollElement="requester.name">
                      <Label htmlFor="508Request-BusinessOwnerName">
                        Business Owner Name
                      </Label>
                      <FormikField
                        as={TextField}
                        id="508Request-BusinessOwnerName"
                        maxLength={50}
                        name="businessOwner.name"
                        disabled
                      />
                    </FieldGroup>

                    <FieldGroup scrollElement="businessOwner.component">
                      <Label htmlFor="508Form-BusinessOwnerComponent">
                        Business Owner Component
                      </Label>

                      <FormikField
                        as={TextField}
                        key="508Form-BusinessOwnerComponent"
                        name="businessOwner.component"
                        disabled
                      />
                    </FieldGroup>
                    <FieldGroup
                      scrollElement="requestName"
                      error={!!flatErrors.requestName}
                    >
                      <Label htmlFor="508Request-RequestName">
                        Request Name
                      </Label>
                      <HelpText id="508Request-RequestName">
                        This name will be shown on the Active requests page. For
                        example, ACME 1.3
                      </HelpText>
                      <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                      <FormikField
                        as={TextField}
                        error={!!flatErrors.requestName}
                        id="508Request-RequestName"
                        maxLength={50}
                        name="requestName"
                      />
                    </FieldGroup>

                    <div className="tablet:grid-col-8">
                      <div className="margin-top-6 margin-bottom-2">
                        <PlainInfo>
                          A request for 508 testing will be added to the list of
                          508 requests. An email will be sent to the Business
                          Owner and the 508 team stating that a request has been
                          added to the system.
                        </PlainInfo>
                      </div>
                    </div>
                    <Button type="submit">Add a new request</Button>
                  </FormikForm>
                </div>
              );
            }}
          </Formik>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default Create;
