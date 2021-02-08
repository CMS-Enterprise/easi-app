import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
// import { Link as UswdsLink } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';
import GetAccessibilityRequestQuery from 'queries/GetAccessibilityRequestQuery';
import { GetAccessibilityRequest } from 'queries/types/GetAccessibilityRequest';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';

import './index.scss';

const AccessibilityRequestDetailPage = () => {
  const { t } = useTranslation('accessibility');
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const { loading, error, data } = useQuery<GetAccessibilityRequest>(
    GetAccessibilityRequestQuery,
    {
      variables: {
        id: accessibilityRequestId
      }
    }
  );

  const requestName = data?.accessibilityRequest?.name;
  const submittedAt = data?.accessibilityRequest?.submittedAt || '';

  // const TEMP_NUM_OF_DOCUMENTS = 0;

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
    <PageWrapper className="accessibility-request">
      <Header />
      <MainContent className="margin-bottom-5">
        <SecondaryNav>
          <NavLink to={`/508/requests/${accessibilityRequestId}`}>
            {t('tabs.accessibilityRequests')}
          </NavLink>
        </SecondaryNav>
        <div className="grid-container">
          <h1 className="margin-top-6 margin-bottom-5">{requestName}</h1>
          <div className="grid-row grid-gap-lg">
            <div className="grid-col-9">
              {/* <h2 className="margin-top-0">
                {t('requestDetails.documents.label')}
              </h2>
              <UswdsLink
                className="usa-button"
                variant="unstyled"
                asCustom={Link}
                to={`/508/requests/${accessibilityRequestId}/document-upload`}
              >
                {t('requestDetails.documentUpload')}
              </UswdsLink>
              <div className="margin-top-6">
                {TEMP_NUM_OF_DOCUMENTS > 0 ? (
                  <span />
                ) : (
                  <span>{t('requestDetails.documents.none')}</span>
                )}
              </div> */}
            </div>
            <div className="grid-col-3">
              <div className="accessibility-request__side-nav">
                <div className="accessibility-request__other-details">
                  <h3>{t('requestDetails.other')}</h3>
                  <dl>
                    <dt className="margin-bottom-1">
                      {t('intake:fields.submissionDate')}
                    </dt>
                    <dd className="margin-0 margin-bottom-2">
                      {DateTime.fromISO(submittedAt).toLocaleString(
                        DateTime.DATE_FULL
                      )}
                    </dd>
                    <dt className="margin-bottom-1">
                      {t('intake:fields.businessOwner')}
                    </dt>
                    <dd className="margin-0 margin-bottom-2">
                      {data?.accessibilityRequest?.businessOwner?.name},{' '}
                      {data?.accessibilityRequest?.businessOwner?.component}
                    </dd>
                    <dt className="margin-bottom-1">
                      {t('intake:lifecycleId')}
                    </dt>
                    <dd className="margin-0 margin-bottom-3">
                      {data?.accessibilityRequest?.lcid}
                    </dd>
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
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default AccessibilityRequestDetailPage;
