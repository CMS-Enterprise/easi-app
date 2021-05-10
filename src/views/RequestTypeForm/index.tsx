import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import { RadioField } from 'components/shared/RadioField';
import { initialSystemIntakeForm } from 'data/systemIntake';
import { AppState } from 'reducers/rootReducer';
import { postSystemIntake } from 'types/routines';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

const RequestTypeForm = () => {
  const { t } = useTranslation('intake');
  const { oktaAuth } = useOktaAuth();
  const dispatch = useDispatch();
  const history = useHistory();

  const isNewIntakeCreated = useSelector(
    (state: AppState) => state.systemIntake.isNewIntakeCreated
  );

  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  const majorChangesExamples: string[] = t(
    'requestTypeForm.helpAndGuidance.majorChanges.list',
    {
      returnObjects: true
    }
  );

  const handleCreateIntake = (formikValues: { requestType: string }) => {
    oktaAuth.getUser().then((user: any) => {
      dispatch(
        postSystemIntake({
          ...initialSystemIntakeForm,
          requestType: formikValues.requestType,
          requester: {
            name: user.name,
            component: '',
            email: user.email
          }
        })
      );
    });
  };

  useEffect(() => {
    if (isNewIntakeCreated) {
      const navigationLink = `/governance-task-list/${systemIntake.id}`;
      switch (systemIntake.requestType) {
        case 'NEW':
          history.push(navigationLink);
          break;
        case 'MAJOR_CHANGES':
          history.push(navigationLink);
          break;
        case 'RECOMPETE':
          history.push(navigationLink);
          break;
        case 'SHUTDOWN':
          history.push(`/system/${systemIntake.id}/contact-details`);
          break;
        default:
          // console.warn(`Unknown request type: ${systemIntake.requestType}`);
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewIntakeCreated]);

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbNav className="margin-y-2">
          <li>
            <Link to="/">Home</Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li aria-current="location">Make a request</li>
        </BreadcrumbNav>
        <h1 className="font-heading-2xl margin-top-4">
          {t('requestTypeForm.heading')}
        </h1>
        <Formik
          initialValues={{ requestType: '' }}
          onSubmit={handleCreateIntake}
          validationSchema={SystemIntakeValidationSchema.requestType}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<{ requestType: string }>) => {
            const { values, errors } = formikProps;
            const flatErrors = flattenErrors(errors);
            return (
              <>
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert
                    testId="system-intake-errors"
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
                <Form>
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
