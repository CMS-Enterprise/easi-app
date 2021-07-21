import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Link as UswdsLink
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import { RadioField } from 'components/shared/RadioField';
import CreateSystemIntake from 'queries/SystemIntakeQueries';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

const RequestTypeForm = () => {
  const { t } = useTranslation('intake');
  const { oktaAuth } = useOktaAuth();
  const history = useHistory();
  const [mutate] = useMutation(CreateSystemIntake);

  const majorChangesExamples: string[] = t(
    'requestTypeForm.helpAndGuidance.majorChanges.list',
    {
      returnObjects: true
    }
  );

  const handleCreateIntake = (formikValues: { requestType: string }) => {
    oktaAuth.getUser().then((user: any) => {
      const { requestType } = formikValues;
      const input = {
        requestType,
        requester: {
          name: user.name
        }
      };

      mutate({ variables: { input } }).then(response => {
        if (!response.errors) {
          const { id } = response.data.createSystemIntake;
          const navigationLink = `/governance-task-list/${id}`;
          switch (requestType) {
            case 'NEW':
              history.push(`/governance-overview/${id}`);
              break;
            case 'MAJOR_CHANGES':
              history.push(navigationLink);
              break;
            case 'RECOMPETE':
              history.push(navigationLink);
              break;
            case 'SHUTDOWN':
              history.push(`/system/${id}/contact-details`);
              break;
            default:
              // console.warn(`Unknown request type: ${systemIntake.requestType}`);
              break;
          }
        }
      });
    });
  };

  return (
    <PageWrapper data-testid="request-type-form">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Make a request</Breadcrumb>
        </BreadcrumbBar>
        <PageHeading>{t('requestTypeForm.heading')}</PageHeading>
        <Formik
          initialValues={{ requestType: '' }}
          onSubmit={handleCreateIntake}
          validationSchema={SystemIntakeValidationSchema.requestType}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<{ requestType: string }>) => {
            const { values, errors, handleSubmit } = formikProps;
            const flatErrors = flattenErrors(errors);
            return (
              <>
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert
                    testId="formik-validation-errors"
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
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <FieldGroup
                    error={!!flatErrors.requestType}
                    scrollElement="requestType"
                  >
                    <fieldset
                      className="usa-fieldset"
                      aria-describedby="RequestType-HelpText"
                    >
                      <legend className="font-heading-xl margin-bottom-4">
                        {t('requestTypeForm.subheading')}
                      </legend>
                      <Field
                        as={RadioField}
                        id="RequestType-NewSystem"
                        className="margin-bottom-4"
                        label={t('requestTypeForm.fields.addNewSystem')}
                        name="requestType"
                        value="NEW"
                        checked={values.requestType === 'NEW'}
                      />
                      <Field
                        as={RadioField}
                        id="RequestType-MajorChangesSystem"
                        className="margin-bottom-4"
                        label={t('requestTypeForm.fields.majorChanges')}
                        name="requestType"
                        value="MAJOR_CHANGES"
                        checked={values.requestType === 'MAJOR_CHANGES'}
                      />
                      <Field
                        as={RadioField}
                        id="RequestType-RecompeteSystem"
                        className="margin-bottom-4"
                        label={t('requestTypeForm.fields.recompete')}
                        name="requestType"
                        value="RECOMPETE"
                        checked={values.requestType === 'RECOMPETE'}
                      />
                      <Field
                        as={RadioField}
                        id="RequestType-ShutdownSystem"
                        className="margin-bottom-4"
                        label={t('requestTypeForm.fields.shutdown')}
                        name="requestType"
                        value="SHUTDOWN"
                        checked={values.requestType === 'SHUTDOWN'}
                      />
                    </fieldset>
                  </FieldGroup>
                  <CollapsableLink
                    id="MajorChangesAccordion"
                    label={t(
                      'requestTypeForm.helpAndGuidance.majorChanges.label'
                    )}
                  >
                    <p>
                      {t('requestTypeForm.helpAndGuidance.majorChanges.para')}
                    </p>
                    <ul className="line-height-body-6">
                      {majorChangesExamples.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CollapsableLink>
                  <HelpText id="RequestType-HelpText" className="margin-top-4">
                    <Trans i18nKey="intake:requestTypeForm.info">
                      indexZero
                      <UswdsLink href="mailto:NavigatorInquiries@cms.hhs.gov">
                        navigatorEmailLink
                      </UswdsLink>
                      indexTwo
                    </Trans>
                  </HelpText>
                  <Button className="margin-top-5 display-block" type="submit">
                    Continue
                  </Button>
                </Form>
              </>
            );
          }}
        </Formik>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default RequestTypeForm;
