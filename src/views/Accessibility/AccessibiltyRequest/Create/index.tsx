/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, ComboBox } from '@trussworks/react-uswds';
import {
  Field as FormikField,
  Form as FormikForm,
  Formik,
  FormikProps
} from 'formik';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import GetSystemsQuery from 'queries/GetSystems';
import { GetSystems } from 'queries/types/GetSystems';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import PlainInfo from 'components/PlainInfo';
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
  const { data } = useQuery<GetSystems>(GetSystemsQuery, {
    variables: {
      // TODO: Is there a way to make this all? or change the query?
      first: 20
    }
  });

  const [mutate, mutationResult] = useMutation(CreateAccessibilityRequestQuery);
  const handleSubmit = (values: AccessibilityRequestForm) => {
    mutate({
      variables: {
        input: {
          name: values.requestName,
          intakeID: values.intakeId
        }
      }
    }).then(() => {
      history.push('/', {
        confirmationText: `${values.requestName} was added to the 508 requests page`
      });
    });
  };

  const systems = useMemo(() => {
    return data?.systems?.edges || [];
  }, [data]);

  const projectComboBoxOptions = useMemo(() => {
    return systems.map(system => {
      const {
        node: { id, name }
      } = system;
      return {
        label: `${name} - ${id}`,
        value: id
      };
    });
  }, [systems]);

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
          <PageHeading>Add a new request</PageHeading>
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
                      {projectComboBoxOptions.length > 0 && (
                        <FieldGroup
                          scrollElement="intakeId"
                          error={!!flatErrors.intakeId}
                        >
                          <Label htmlFor="508Request-IntakeId">
                            Choose the project this request will belong to
                          </Label>
                          <FieldErrorMsg>{flatErrors.intakeId}</FieldErrorMsg>
                          <ComboBox
                            name="intakeId"
                            id="508Request-IntakeId"
                            options={projectComboBoxOptions}
                            onChange={intakeId => {
                              const selectedSystem = systems.find(
                                system => system.node.id === intakeId
                              );
                              setFieldValue('intakeId', intakeId || '');
                              setFieldValue(
                                'businessOwner.name',
                                selectedSystem?.node.businessOwner.name || ''
                              );
                              setFieldValue(
                                'businessOwner.component',
                                selectedSystem?.node.businessOwner.component ||
                                  ''
                              );
                            }}
                          />
                        </FieldGroup>
                      )}

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
