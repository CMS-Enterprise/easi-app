import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import { useMessage } from 'hooks/useMessage';
import CreateTestDateQuery from 'queries/CreateTestDateQuery';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import { CreateTestDate } from 'queries/types/CreateTestDate';
import { GetAccessibilityRequest } from 'queries/types/GetAccessibilityRequest';
import { TestDateFormType } from 'types/accessibility';
import { formatDate } from 'utils/date';

import PageLoading from '../../components/PageLoading';
import RequestDeleted from '../Accessibility/RequestDeleted';

import Form from './Form';

import './styles.scss';

const NewTestDate = () => {
  const { t } = useTranslation('accessibility');
  const { message, showMessageOnNextPage } = useMessage();

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

    const submitConfirmation = `
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
    }).then(result => {
      if (!result.errors) {
        showMessageOnNextPage(submitConfirmation);
        history.push(`/508/requests/${accessibilityRequestId}/documents`);
      }
    });
  };

  if (loading) {
    return <PageLoading />;
  }

  if (data?.accessibilityRequest?.statusRecord.status === 'DELETED') {
    return <RequestDeleted />;
  }

  return (
    <>
      <SecondaryNav>
        <NavLink to="/">{t('tabs.accessibilityRequests')}</NavLink>
      </SecondaryNav>
      <div className="grid-container">
        {message && (
          <Alert className="margin-top-4" type="success" role="alert">
            {message}
          </Alert>
        )}
        <Form
          initialValues={initialValues}
          onSubmit={onSubmit}
          error={mutateResult.error}
          requestName={data?.accessibilityRequest?.name || ''}
          requestId={accessibilityRequestId}
          formType="create"
        />
      </div>
    </>
  );
};

export default NewTestDate;
