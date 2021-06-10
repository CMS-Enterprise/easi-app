import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Fieldset,
  Link as UswdsLink,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import GetAccessibilityRequestForStatusChange from 'queries/GetAccessibilityRequestForStatusChange';
import UpdateAccessibilityRequestStatus from 'queries/UpdateAccessibilityRequestStatusQuery';

import PageHeading from 'components/PageHeading';
import PlainInfo from 'components/PlainInfo';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import useMessage from 'hooks/useMessage';
import { AccessibilityRequestStatus } from 'types/graphql-global-types';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { NotFoundPartial } from 'views/NotFound';

type ChangeRequestStatusForm = {
  status: AccessibilityRequestStatus;
};

const ChangeRequestStatus = () => {
  const history = useHistory();
  const { t } = useTranslation('accessibility');
  const { showMessageOnNextPage } = useMessage();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, data } = useQuery(GetAccessibilityRequestForStatusChange, {
    variables: {
      id: accessibilityRequestId
    }
  });

  const [mutate, mutationResult] = useMutation(
    UpdateAccessibilityRequestStatus
  );
  const initialValues = {
    status:
      data?.accessibilityRequest?.statusRecord.status ||
      AccessibilityRequestStatus.OPEN
  };

  const handleSubmit = (values: ChangeRequestStatusForm) => {
    mutate({
      variables: {
        input: {
          requestID: accessibilityRequestId,
          status: values.status
        }
      }
    }).then(response => {
      if (!response.errors) {
        showMessageOnNextPage(
          t('updateRequestStatus.confirmation', {
            status:
              accessibilityRequestStatusMap[
                response.data.updateAccessibilityRequestStatus.status
              ],
            requestName: data.accessibilityRequest?.name
          })
        );
        history.push(`/508/requests/${accessibilityRequestId}`);
      }
    });
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return (
      <div className="grid-container">
        <NotFoundPartial />
      </div>
    );
  }

  return (
    <div
      className="grid-container margin-y-5"
      data-testid="change-request-status-view"
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formikProps: FormikProps<ChangeRequestStatusForm>) => {
          const { values } = formikProps;

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
              <PageHeading>
                {t('updateRequestStatus.heading', {
                  requestName: data.accessibilityRequest?.name
                })}
              </PageHeading>
              <div className="tablet:grid-col-10">
                <Form>
                  <FieldGroup>
                    <Fieldset
                      className="display-inline-block"
                      legend={t('updateRequestStatus.statusFieldLegend', {
                        requestName: data.accessibilityRequest?.name
                      })}
                      legendStyle="srOnly"
                    >
                      <Field
                        as={Radio}
                        id="RequestStatus-Open"
                        name="status"
                        label={t('requestStatus.open')}
                        value="OPEN"
                        checked={values.status === 'OPEN'}
                      />
                      <Field
                        as={Radio}
                        id="RequestStatus-Remediation"
                        name="status"
                        label={t('requestStatus.remediation')}
                        value="IN_REMEDIATION"
                        checked={values.status === 'IN_REMEDIATION'}
                      />
                      <Field
                        as={Radio}
                        id="RequestStatus-Closed"
                        name="status"
                        label={t('requestStatus.closed')}
                        value="CLOSED"
                        checked={values.status === 'CLOSED'}
                      />
                    </Fieldset>
                  </FieldGroup>
                  <PlainInfo className="margin-top-2" small>
                    {t('updateRequestStatus.changeStatusDisclaimer')}
                  </PlainInfo>
                  <Button type="submit" className="margin-top-4">
                    {t('updateRequestStatus.submit')}
                  </Button>
                  <UswdsLink
                    className="display-block margin-top-3"
                    asCustom={Link}
                    to={`/508/requests/${accessibilityRequestId}`}
                  >
                    {t('updateRequestStatus.cancel')}
                  </UswdsLink>
                </Form>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default ChangeRequestStatus;
