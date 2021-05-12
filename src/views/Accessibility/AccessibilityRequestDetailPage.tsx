import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Alert, Button, Link as UswdsLink } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { DateTime } from 'luxon';
import { DeleteAccessibilityRequestQuery } from 'queries/AccessibilityRequestQueries';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import {
  DeleteAccessibilityRequest,
  DeleteAccessibilityRequestVariables
} from 'queries/types/DeleteAccessibilityRequest';
import {
  GetAccessibilityRequest,
  GetAccessibilityRequestVariables
} from 'queries/types/GetAccessibilityRequest';

import AccessibilityDocumentsList from 'components/AccessibilityDocumentsList';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import TestDateCard from 'components/TestDateCard';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import { formatDate } from 'utils/date';
import user from 'utils/user';
import { NotFoundPartial } from 'views/NotFound';

import './index.scss';

const AccessibilityRequestDetailPage = () => {
  const { t } = useTranslation('accessibility');
  const [isModalOpen, setModalOpen] = useState(false);
  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const history = useHistory();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, error, data, refetch } = useQuery<
    GetAccessibilityRequest,
    GetAccessibilityRequestVariables
  >(GetAccessibilityRequestQuery, {
    variables: {
      id: accessibilityRequestId
    }
  });
  const [mutate] = useMutation<
    DeleteAccessibilityRequest,
    DeleteAccessibilityRequestVariables
  >(DeleteAccessibilityRequestQuery);

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

  const removeRequest = () => {
    mutate({
      variables: {
        input: {
          id: accessibilityRequestId
        }
      }
    }).then(response => {
      if (!response.errors) {
        showMessageOnNextPage(
          t('requestDetails.removeConfirmationText', {
            requestName
          })
        );
        history.push('/');
      }
    });
  };

  const flags = useFlags();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isAccessibilityTeam = user.isAccessibilityTeam(userGroups, flags);

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

  // What type of errors can we get/return?
  // How can we actually use the errors?
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
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
                setConfirmationText={showMessage}
                refetchRequest={refetch}
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
                      testDate={testDate}
                      testIndex={index + 1}
                      requestName={requestName}
                      requestId={accessibilityRequestId}
                      isEditableDeletable={isAccessibilityTeam}
                      refetchRequest={refetch}
                      setConfirmationText={showMessage}
                    />
                  ))}
                {isAccessibilityTeam && (
                  <Link
                    to={`/508/requests/${accessibilityRequestId}/test-date`}
                    className="margin-bottom-3 display-block"
                    aria-label="Add a test date"
                  >
                    Add a date
                  </Link>
                )}
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
              <UswdsLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                href="/508/testing-overview"
              >
                {t('requestDetails.testingSteps')}
              </UswdsLink>
              <button
                type="button"
                className="accessibility-request__remove-request"
                onClick={() => setModalOpen(true)}
              >
                {t('requestDetails.remove')}
              </button>
              <Modal
                isOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
              >
                <PageHeading
                  headingLevel="h2"
                  className="margin-top-0 line-height-heading-2 margin-bottom-2"
                >
                  {t('requestDetails.modal.header', {
                    requestName
                  })}
                </PageHeading>
                <span>{t('requestDetails.modal.subhead')}</span>
                <div className="display-flex margin-top-2">
                  <Button
                    type="button"
                    className="margin-right-5"
                    onClick={removeRequest}
                  >
                    {t('requestDetails.modal.confirm')}
                  </Button>
                  <Button
                    type="button"
                    unstyled
                    onClick={() => setModalOpen(false)}
                  >
                    {t('requestDetails.modal.cancel')}
                  </Button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityRequestDetailPage;
