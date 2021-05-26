/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, ComboBox, Link } from '@trussworks/react-uswds';
import {
  Field as FormikField,
  Form as FormikForm,
  Formik,
  FormikProps
} from 'formik';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import GetSystemsQuery from 'queries/GetSystems';
import {
  GetSystems,
  GetSystems_systems_edges_node as SystemNode
} from 'queries/types/GetSystems';

import PageHeading from 'components/PageHeading';
import PlainInfo from 'components/PlainInfo';
import { AlertText } from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TextField from 'components/shared/TextField';
import { initialAccessibilityRequestFormData } from 'data/accessibility';
import useMessage from 'hooks/useMessage';
import { AccessibilityRequestForm } from 'types/accessibility';
import flattenErrors from 'utils/flattenErrors';
import accessibilitySchema from 'validations/accessibilitySchema';

const Create = () => {
  const history = useHistory();
  const { t } = useTranslation('accessibility');
  const { showMessageOnNextPage } = useMessage();

  const { data, loading } = useQuery<GetSystems>(GetSystemsQuery, {
    variables: {
      // TODO: Is there a way to make this all? or change the query?
      first: 20
    }
  });

  const [mutate, mutationResult] = useMutation(CreateAccessibilityRequestQuery);
  const handleSubmitForm = (values: AccessibilityRequestForm) => {
    mutate({
      variables: {
        input: {
          name: values.requestName,
          intakeID: values.intakeId
        }
      }
    }).then(response => {
      if (!response.errors) {
        const uuid =
          response.data.createAccessibilityRequest.accessibilityRequest.id;
        showMessageOnNextPage(
          <>
            <AlertText>{t('newRequestForm.confirmation')}</AlertText>
            <br />
            <Link
              href="https://www.surveymonkey.com/r/3R6MXSW"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tell us what you think of this service (opens in a new tab)
            </Link>
          </>
        );
        history.push(`/508/requests/${uuid}`);
      }
    });
  };

  const systems = useMemo(() => {
    const systemsObj: { [id: string]: SystemNode } = {};

    data?.systems?.edges.forEach(system => {
      systemsObj[system.node.id] = system.node;
    });

    return systemsObj;
  }, [data]);

  const projectComboBoxOptions = useMemo(() => {
    const queriedSystems = data?.systems?.edges || [];
    return queriedSystems.map(system => {
      const {
        node: { id, lcid, name }
      } = system;
      return {
        label: `${name} - ${lcid}`,
        value: id
      };
    });
  }, [data]);

  return (
    <>
      <SecondaryNav>
        <NavLink to="/">{t('tabs.accessibilityRequests')}</NavLink>
      </SecondaryNav>
      <div className="grid-container">
        <PageHeading>{t('newRequestForm.heading')}</PageHeading>
        <Formik
          initialValues={initialAccessibilityRequestFormData}
          onSubmit={handleSubmitForm}
          validationSchema={accessibilitySchema.requestForm}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<AccessibilityRequestForm>) => {
            const { errors, setFieldValue, handleSubmit } = formikProps;
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
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert
                    testId="508-request-errors"
                    classNames="margin-bottom-4 margin-top-4"
                    heading="There is a problem"
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
                <div className="margin-bottom-7">
                  <FormikForm
                    onSubmit={e => {
                      handleSubmit(e);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {!loading && (
                      <FieldGroup
                        scrollElement="intakeId"
                        error={!!flatErrors.intakeId}
                      >
                        <Label htmlFor="508Request-IntakeId">
                          {t('newRequestForm.fields.project.label')}
                        </Label>
                        <FieldErrorMsg>{flatErrors.intakeId}</FieldErrorMsg>
                        <ComboBox
                          id="508Request-IntakeComboBox"
                          name="intakeComboBox"
                          inputProps={{
                            id: '508Request-IntakeId',
                            name: 'intakeId'
                          }}
                          options={projectComboBoxOptions}
                          onChange={(intakeId: any) => {
                            const selectedSystem = systems[intakeId];
                            if (selectedSystem) {
                              setFieldValue('intakeId', intakeId || '');
                              setFieldValue(
                                'businessOwner.name',
                                selectedSystem.businessOwner.name || ''
                              );
                              setFieldValue(
                                'businessOwner.component',
                                selectedSystem.businessOwner.component || ''
                              );
                            }
                          }}
                        />
                      </FieldGroup>
                    )}

                    <FieldGroup scrollElement="requester.name">
                      <Label htmlFor="508Request-BusinessOwnerName">
                        {t('newRequestForm.fields.businessOwnerName.label')}
                      </Label>
                      <HelpText
                        id="508Request-BusinessOwnerNameHelp"
                        className="usa-sr-only"
                      >
                        {t('newRequestForm.fields.businessOwnerName.help')}
                      </HelpText>
                      <FormikField
                        as={TextField}
                        id="508Request-BusinessOwnerName"
                        name="businessOwner.name"
                        aria-describedby="508Request-BusinessOwnerNameHelp"
                        disabled
                      />
                    </FieldGroup>

                    <FieldGroup scrollElement="businessOwner.component">
                      <Label htmlFor="508Form-BusinessOwnerComponent">
                        {t(
                          'newRequestForm.fields.businessOwnerComponent.label'
                        )}
                      </Label>
                      <HelpText
                        id="508Request-BusinessOwnerComponentHelp"
                        className="usa-sr-only"
                      >
                        {t('newRequestForm.fields.businessOwnerComponent.help')}
                      </HelpText>
                      <FormikField
                        as={TextField}
                        id="508Form-BusinessOwnerComponent"
                        name="businessOwner.component"
                        aria-describedby="508Request-BusinessOwnerComponentHelp"
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
    </>
  );
};

export default Create;
