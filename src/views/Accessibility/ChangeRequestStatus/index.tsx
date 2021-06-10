import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Fieldset,
  Link as UswdsLink,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  GetAccessibilityRequest,
  GetAccessibilityRequestVariables
} from 'queries/types/GetAccessibilityRequest';
import UpdateAccessibilityRequestStatus from 'queries/UpdateAccessibilityRequestStatusQuery';

import PageHeading from 'components/PageHeading';
import PlainInfo from 'components/PlainInfo';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import { AccessibilityRequestStatus } from 'types/graphql-global-types';
import { NotFoundPartial } from 'views/NotFound';

type ChangeRequestStatusForm = {
  status: AccessibilityRequestStatus;
};

const ChangeRequestStatus = () => {
  const history = useHistory();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, data } = useQuery<
    GetAccessibilityRequest,
    GetAccessibilityRequestVariables
  >(GetAccessibilityRequestQuery, {
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
    console.log('submitting');
    mutate({
      variables: {
        input: {
          requestID: accessibilityRequestId,
          status: values.status
        }
      }
    }).then(response => {
      if (!response.errors) {
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
    <div className="grid-container margin-y-5">
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
                Choose a status for Medicare Office of Change Initiative
              </PageHeading>
              <div className="tablet:grid-col-10">
                <Form>
                  <FieldGroup>
                    <Fieldset
                      className="display-inline-block"
                      legend="Choose a status for Medicare Office of Change Initiative"
                      legendStyle="srOnly"
                    >
                      <Field
                        as={Radio}
                        id="RequestStatus-Open"
                        name="status"
                        label="Open"
                        value="OPEN"
                        checked={values.status === 'OPEN'}
                      />
                      <Field
                        as={Radio}
                        id="RequestStatus-Remediation"
                        name="status"
                        label="In Remediation"
                        value="IN_REMEDIATION"
                        checked={values.status === 'IN_REMEDIATION'}
                      />
                      <Field
                        as={Radio}
                        id="RequestStatus-Closed"
                        name="status"
                        label="Closed"
                        value="CLOSED"
                        checked={values.status === 'CLOSED'}
                      />
                    </Fieldset>
                  </FieldGroup>
                  <PlainInfo className="margin-top-2" small>
                    Changing the request status will send an email to all
                    members of the 508 team letting them know about the new
                    status.
                  </PlainInfo>
                  <Button type="submit" className="margin-top-4">
                    Change status
                  </Button>
                  <UswdsLink
                    className="display-block margin-top-3"
                    asCustom={Link}
                    to={`/508/request/${accessibilityRequestId}`}
                  >
                    Don&apos;t change status and return to request page
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
