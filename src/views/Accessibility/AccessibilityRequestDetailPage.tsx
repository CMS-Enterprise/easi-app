import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
// import { Link as UswdsLink } from '@trussworks/react-uswds';
import { Alert } from '@trussworks/react-uswds';
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
  const [confirmationText, setIsConfirmationText] = useState('');

  const history = useHistory();
  const location = useLocation<any>();
  useEffect(() => {
    if (location.state && location.state.confirmationText) {
      setIsConfirmationText(location.state.confirmationText);
      history.replace({
        state: {}
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {confirmationText && (
            <Alert className="margin-top-4" type="success">
              {confirmationText}
            </Alert>
          )}
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
                <div>
                  <h2 className="margin-top-2 margin-bottom-3">
                    Test Dates and Scores
                  </h2>
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
                      {DateTime.fromISO(submittedAt).toLocaleString(
                        DateTime.DATE_FULL
                      )}
                    </dd>
                    {/* <dt className="margin-bottom-1">
                      {t('intake:fields.businessOwner')}
                    </dt>
                    <dd className="margin-0 margin-bottom-2">
                      Shane Clark, OIT
                    </dd>
                    <dt className="margin-bottom-1">
                      {t('intake:lifecycleId')}
                    </dt>
                    <dd className="margin-0 margin-bottom-3">X200943</dd> */}
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
