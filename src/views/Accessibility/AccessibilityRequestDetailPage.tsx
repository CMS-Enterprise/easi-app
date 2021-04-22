import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  GetAccessibilityRequest,
  GetAccessibilityRequestVariables
} from 'queries/types/GetAccessibilityRequest';

import AccessibilityDocumentsList from 'components/AccessibilityDocumentsList';
import PageHeading from 'components/PageHeading';
import TestDateCard from 'components/TestDateCard';
import { formatDate } from 'utils/date';

import './index.scss';

const AccessibilityRequestDetailPage = () => {
  const { t } = useTranslation('accessibility');
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, error, data } = useQuery<
    GetAccessibilityRequest,
    GetAccessibilityRequestVariables
  >(GetAccessibilityRequestQuery, {
    variables: {
      id: accessibilityRequestId
    }
  });

  const requestName = data?.accessibilityRequest?.name || '';
  const systemName = data?.accessibilityRequest?.system.name || '';
  const submittedAt = data?.accessibilityRequest?.submittedAt || '';
  const lcid = data?.accessibilityRequest?.system.lcid;
  const businessOwnerName =
    data?.accessibilityRequest?.system?.businessOwner?.name;
  const businessOwnerComponent =
    data?.accessibilityRequest?.system?.businessOwner?.component;
  const documents = data?.accessibilityRequest?.documents || [];
  const testDates = data?.accessibilityRequest?.testDates || [];

  if (loading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return (
      <div>{`No request found matching id: ${accessibilityRequestId}`}</div>
    );
  }

  // What type of errors can we get/return?
  // How can we actually use the errors?
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <>
      <PageHeading>{requestName}</PageHeading>
      <div className="grid-row grid-gap-lg">
        <div className="grid-col-9">
          <h2 className="margin-top-0">
            {t('requestDetails.documents.label')}
          </h2>
          <UswdsLink
            className="usa-button"
            variant="unstyled"
            asCustom={Link}
            to={`/508/requests/${accessibilityRequestId}/documents/new`}
          >
            {t('requestDetails.documentUpload')}
          </UswdsLink>
          <div className="margin-top-6">
            <AccessibilityDocumentsList
              documents={documents}
              requestName={requestName}
              requestId={accessibilityRequestId}
            />
          </div>
        </div>
        <div className="grid-col-3">
          <div className="accessibility-request__side-nav">
            <div>
              <h2 className="margin-top-2 margin-bottom-3">
                Test Dates and Scores
              </h2>
              {[...testDates]
                .sort(
                  (a, b) =>
                    DateTime.fromISO(a.date).toMillis() -
                    DateTime.fromISO(b.date).toMillis()
                )
                .map((testDate, index) => (
                  <TestDateCard
                    key={testDate.id}
                    date={testDate.date}
                    type={testDate.testType}
                    testIndex={index + 1}
                    score={testDate.score}
                    id={testDate.id}
                    requestId={accessibilityRequestId}
                  />
                ))}
              <Link
                to={`/508/requests/${accessibilityRequestId}/test-date`}
                className="margin-bottom-3 display-block"
                aria-label="Add a test date"
              >
                Add a date
              </Link>
            </div>
            <div className="accessibility-request__other-details">
              <h3>{t('requestDetails.other')}</h3>
              <dl>
                <dt className="margin-bottom-1">
                  {t('intake:fields.submissionDate')}
                </dt>
                <dd className="margin-0 margin-bottom-2">
                  {formatDate(submittedAt)}
                </dd>
                <dt className="margin-bottom-1">
                  {t('intake:fields.businessOwner')}
                </dt>
                <dd className="margin-0 margin-bottom-2">
                  {businessOwnerName}, {businessOwnerComponent}
                </dd>
                <dt className="margin-bottom-1">
                  {t('intake:fields:projectName')}
                </dt>
                <dd className="margin-0 margin-bottom-3">{systemName}</dd>
                <dt className="margin-bottom-1">{t('intake:lifecycleId')}</dt>
                <dd className="margin-0 margin-bottom-3">{lcid}</dd>
              </dl>
            </div>
            {/* <button
              type="button"
              className="accessibility-request__remove-request"
            >
              {t('requestDetails.remove')}
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityRequestDetailPage;
