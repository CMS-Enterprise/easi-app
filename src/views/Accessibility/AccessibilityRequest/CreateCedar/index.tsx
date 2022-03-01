/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Alert, Button, ComboBox, Link } from '@trussworks/react-uswds';
import { Form as FormikForm, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { AlertText } from 'components/shared/Alert';
import CollapsibleLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { initialAccessibilityRequestFormDataCedar } from 'data/accessibility';
import useMessage from 'hooks/useMessage';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import GetCedarSystemIdsQuery from 'queries/GetCedarSystemIdsQuery';
import { GetCedarSystemIds } from 'queries/types/GetCedarSystemIds';
import { AccessibilityRequestFormCedar } from 'types/accessibility';
import flattenErrors from 'utils/flattenErrors';
import accessibilitySchema from 'validations/accessibilitySchema';

const CreateCedar = () => {
  const history = useHistory();
  const { t } = useTranslation('accessibility');
  const { showMessageOnNextPage } = useMessage();

  const { data, loading } = useQuery<GetCedarSystemIds>(GetCedarSystemIdsQuery);

  const [mutate, mutationResult] = useMutation(CreateAccessibilityRequestQuery);
  const handleSubmitForm = (values: AccessibilityRequestFormCedar) => {
    mutate({
      variables: {
        input: {
          name: values.requestName,
          cedarSystemId: values.cedarId
        }
      }
    }).then(response => {
      if (!response.errors) {
        const uuid =
          response.data.createAccessibilityRequest.accessibilityRequest.id;
        showMessageOnNextPage(
          <>
            <AlertText className="margin-bottom-2">
              {t('newRequestForm.confirmation')}
            </AlertText>
            <Link
              href="https://www.surveymonkey.com/r/3R6MXSW"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('newRequestForm.surveyLink')}
            </Link>
          </>
        );
        history.push(`/508/requests/${uuid}/documents`);
      }
    });
  };

  const projectComboBoxOptions = useMemo(() => {
    return (data?.cedarSystems || []).map(system => {
      return {
        label: system!.name!,
        value: system!.id!
      };
    });
  }, [data]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <div className="grid-container" data-testid="create-508-request">
        <PageHeading>{t('newRequestForm.heading')}</PageHeading>
        <Formik
          initialValues={initialAccessibilityRequestFormDataCedar}
          onSubmit={handleSubmitForm}
          validationSchema={accessibilitySchema.requestFormCedar}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<AccessibilityRequestFormCedar>) => {
            const { errors, setFieldValue, handleSubmit, dirty } = formikProps;
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
                    <FieldGroup
                      scrollElement="intakeId"
                      error={!!flatErrors.intakeId}
                    >
                      <Label htmlFor="508Request-IntakeId">
                        {t('newRequestForm.fields.project.label')}
                      </Label>
                      <HelpText id="508Request-IntakeId-HelpText">
                        {t('newRequestForm.fields.project.helpText')}
                      </HelpText>
                      <FieldErrorMsg>{flatErrors.intakeId}</FieldErrorMsg>
                      <ComboBox
                        id="508Request-IntakeComboBox"
                        name="intakeComboBox"
                        inputProps={{
                          id: '508Request-IntakeId',
                          name: 'intakeId',
                          'aria-describedby': '508Request-IntakeId-HelpText'
                        }}
                        options={projectComboBoxOptions}
                        onChange={cedarId => {
                          const system = data?.cedarSystems?.find(
                            cedarSystem => cedarSystem?.id === cedarId
                          );
                          if (system) {
                            setFieldValue('cedarId', system.id);
                            setFieldValue('requestName', system.name);
                          } else {
                            setFieldValue('cedarId', '');
                            setFieldValue('requestName', '');
                          }
                        }}
                      />
                    </FieldGroup>
                    <div className="tablet:grid-col-8">
                      <div className="margin-top-4">
                        <CollapsibleLink
                          id="LifecycleIdAccordion"
                          label={t(
                            'newRequestForm.helpAndGuidance.lifecycleIdAccordion.header'
                          )}
                        >
                          <p>
                            <Trans i18nKey="accessibility:newRequestForm.helpAndGuidance.lifecycleIdAccordion.description">
                              indexZero
                              <Link href="mailto:IT_Governance@cms.hhs.gov">
                                email
                              </Link>
                              indexTwo
                            </Trans>
                          </p>
                        </CollapsibleLink>
                      </div>
                    </div>
                    <div className="tablet:grid-col-8">
                      <div className="margin-top-2 margin-bottom-2">
                        <Alert type="info">{t('newRequestForm.info')}</Alert>
                      </div>
                    </div>
                    <Button type="submit" disabled={!dirty}>
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

export default CreateCedar;
