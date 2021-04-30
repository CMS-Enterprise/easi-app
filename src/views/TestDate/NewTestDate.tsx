import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';
import CreateTestDateQuery from 'queries/CreateTestDateQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import { CreateTestDate } from 'queries/types/CreateTestDate';
import { GetAccessibilityRequest } from 'queries/types/GetAccessibilityRequest';

import useConfirmationText from 'hooks/useConfirmationText';
import { TestDateFormType } from 'types/accessibility';
import { formatDate } from 'utils/date';

import Form from './Form';

import './styles.scss';

const NewTestDate = () => {
  const { t } = useTranslation('accessibility');
  const { confirmationText } = useConfirmationText();

  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const [mutate, mutateResult] = useMutation<CreateTestDate>(
    CreateTestDateQuery,
    {
      errorPolicy: 'all'
    }
  );
  const { data, loading } = useQuery<GetAccessibilityRequest>(
    GetAccessibilityRequestQuery,
    {
      variables: {
        id: accessibilityRequestId
      }
    }
  );
  const history = useHistory();

  const initialValues: TestDateFormType = {
    testType: null,
    dateMonth: '',
    dateDay: '',
    dateYear: '',
    score: {
      isPresent: false,
      value: ''
    }
  };

  const onSubmit = (values: TestDateFormType) => {
    const date = DateTime.fromObject({
      day: Number(values.dateDay),
      month: Number(values.dateMonth),
      year: Number(values.dateYear)
    });
    const hasScore = values.score.isPresent;
    const score = values.score.value;

    const confirmation = `
      ${t('testDateForm.confirmation.date', { date: formatDate(date) })}
      ${hasScore ? t('testDateForm.confirmation.score', { score }) : ''}
      ${t('testDateForm.confirmation.create')}
    `;

    mutate({
      variables: {
        input: {
          date,
          score: hasScore ? Math.round(parseFloat(score) * 10) : null,
          testType: values.testType,
          requestID: accessibilityRequestId
        }
      }
    }).then(() => {
      history.push(`/508/requests/${accessibilityRequestId}`, {
        confirmationText: confirmation
      });
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {confirmationText && (
        <Alert className="margin-top-4" type="success" role="alert">
          {confirmationText}
        </Alert>
      )}
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        error={mutateResult.error}
        requestName={data?.accessibilityRequest?.name}
        requestId={accessibilityRequestId}
        formType="create"
      />
    </>
  );
};

export default NewTestDate;
