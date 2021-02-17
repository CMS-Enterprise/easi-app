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
        confirmationText: t('newRequestForm.confirmation', {
          requestName: values.requestName
        })
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
          <PageHeading>{t('newRequestForm.heading')}</PageHeading>
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
                            {t('newRequestForm.fields.project.label')}
                          </Label>
                          <FieldErrorMsg>{flatErrors.intakeId}</FieldErrorMsg>
                          <ComboBox
                            name="intakeId"
                            id="508Request-IntakeId"
                            options={projectComboBoxOptions}
                            onChange={(intakeId: any) => {
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
                          {t('newRequestForm.fields.businessOwnerName.label')}
                        </Label>
                        <FormikField
                          as={TextField}
                          id="508Request-BusinessOwnerName"
                          name="businessOwner.name"
                          disabled
                        />
                      </FieldGroup>

                      <FieldGroup scrollElement="businessOwner.component">
                        <Label htmlFor="508Form-BusinessOwnerComponent">
                          {t(
                            'newRequestForm.fields.businessOwnerComponent.label'
                          )}
                        </Label>

                        <FormikField
                          as={TextField}
                          id="508Form-BusinessOwnerComponent"
                          name="businessOwner.component"
                          disabled
                        />
                      </FieldGroup>
                      <FieldGroup
                        scrollElement="requestName"
                        error={!!flatErrors.requestName}
                      >
                        <Label htmlFor="508Request-RequestName">
                          {t('newRequestForm.fields.requestName.label')}
                        </Label>
                        <HelpText
                          id="508Request-RequestNameHelp"
                          className="margin-top-1"
                        >
                          {t('newRequestForm.fields.requestName.help')}
                        </HelpText>
                        <FieldErrorMsg>{flatErrors.requestName}</FieldErrorMsg>
                        <FormikField
                          as={TextField}
                          error={!!flatErrors.requestName}
                          id="508Request-RequestName"
                          maxLength={50}
                          name="requestName"
                          aria-describedby="508Request-RequestNameHelp"
                        />
                      </FieldGroup>

                      <div className="tablet:grid-col-8">
                        <div className="margin-top-6 margin-bottom-2">
                          <PlainInfo>{t('newRequestForm.info')}</PlainInfo>
                        </div>
                      </div>
                      <Button type="submit">
                        {t('newRequestForm.submitBtn')}
                      </Button>
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
