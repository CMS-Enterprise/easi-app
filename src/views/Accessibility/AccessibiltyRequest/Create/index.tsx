/* eslint-disable react/prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import {
  Field as FormikField,
  Form as FormikForm,
  Formik,
  FormikProps
} from 'formik';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import PlainInfo from 'components/PlainInfo';
import { DropdownField, DropdownItem } from 'components/shared/DropdownField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextField from 'components/shared/TextField';
import { initialAccessibilityRequestFormData } from 'data/accessibility';
import { AccessibilityRequestForm } from 'types/accessibility';
import flattenErrors from 'utils/flattenErrors';
import accessibilitySchema from 'validations/accessibilitySchema';

const Create = () => {
  const history = useHistory();
  const { t } = useTranslation('accessibility');
  const [mutate, mutationResult] = useMutation(CreateAccessibilityRequestQuery);
  const handleSubmit = (values: AccessibilityRequestForm) => {
    mutate({
      variables: {
        input: {
          name: values.requestName,
          intakeID: values.intakeId
        }
      }
    })
      .then(() => {
        history.push('/', {
          confirmationText: `${values.requestName} was added to the 508 requests page`
        });
      })
      .catch(err => {
        console.warn(err);
      });
  };

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
            onSubmit={handleSubmit}
            validationSchema={accessibilitySchema.requestForm}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
          >
            {(formikProps: FormikProps<AccessibilityRequestForm>) => {
              const { errors, setFieldValue } = formikProps;
              const flatErrors = flattenErrors(errors);
              return (
                <>
                  {mutationResult.error && (
                    <ErrorAlert heading="System error">
                      <ErrorAlertMessage
                        message={mutationResult.error.message}
                        errorKey="system"
                      />
                    </ErrorAlert>
                  )}
                  <div className="margin-bottom-7">
                    <FormikForm>
                      <FieldGroup
                        scrollElement="intakeId"
                        error={!!flatErrors.intakeId}
                      >
                        <Label htmlFor="508Request-IntakeId">
                          Choose the project this request will belong to
                        </Label>
                        <FieldErrorMsg>{flatErrors.intakeId}</FieldErrorMsg>
                        <FormikField
                          as={DropdownField}
                          error={!!flatErrors.intakeId}
                          name="intakeId"
                          id="508Request-IntakeId"
                          onChange={(e: any) => {
                            const selectedIntake = [
                              {
                                id: '189c4ed7-16a3-47f8-b24b-f3966b969c6c',
                                businessOwner: {
                                  name: 'Test 1 Business Owner',
                                  component: 'Office of Information Technology'
                                }
                              },
                              {
                                id: '189c4ed7-16a3-47f8-b24b-f3966b969c6c',
                                businessOwner: {
                                  name: 'Test 2 Business Owner',
                                  component: 'Office of Information Technology'
                                }
                              },
                              {
                                id: '189c4ed7-16a3-47f8-b24b-f3966b969c6c',
                                businessOwner: {
                                  name: 'Test 3 Business Owner',
                                  component: 'Office of Information Technology'
                                }
                              },
                              {
                                id: '189c4ed7-16a3-47f8-b24b-f3966b969c6c',
                                businessOwner: {
                                  name: 'Test 4 Business Owner',
                                  component: 'Office of Information Technology'
                                }
                              }
                            ].find(intake => intake.id === e.target.value);
                            setFieldValue('intakeId', e.target.value);
                            setFieldValue(
                              'businessOwner.name',
                              selectedIntake?.businessOwner.name
                            );
                            setFieldValue(
                              'businessOwner.component',
                              selectedIntake?.businessOwner.component
                            );
                          }}
                        >
                          <FormikField
                            as={DropdownItem}
                            name="Select an option"
                            value=""
                            disabled
                          />
                          <FormikField
                            as={DropdownItem}
                            name="Test 1"
                            value="189c4ed7-16a3-47f8-b24b-f3966b969c6c"
                          />
                          <FormikField
                            as={DropdownItem}
                            name="Test 2"
                            value="189c4ed7-16a3-47f8-b24b-f3966b969c6c"
                          />
                          <FormikField
                            as={DropdownItem}
                            name="Test 3"
                            value="189c4ed7-16a3-47f8-b24b-f3966b969c6c"
                          />
                          <FormikField
                            as={DropdownItem}
                            name="Test 4"
                            value="189c4ed7-16a3-47f8-b24b-f3966b969c6c"
                          />
                        </FormikField>
                      </FieldGroup>
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
                          This name will be shown on the Active requests page.
                          For example, ACME 1.3
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
                            A request for 508 testing will be added to the list
                            of 508 requests. An email will be sent to the
                            Business Owner and the 508 team stating that a
                            request has been added to the system.
                          </PlainInfo>
                        </div>
                      </div>
                      <Button type="submit">Add a new request</Button>
                    </FormikForm>
                  </div>
                </>
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
