import React, { useState } from 'react';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';

import './index.scss';

const AccessibilityRequestDetailPage = () => {
  const [activeNavTab, setActiveNavTab] = useState('508');
  const tabClasses = (tab: string) => {
    return classnames('accessibility-request__nav-btn', {
      'accessibility-request__nav-btn--active': activeNavTab === tab
    });
  };
  return (
    <PageWrapper className="accessibility-request">
      <Header />
      <MainContent className="margin-bottom-5">
        <nav
          aria-label="Something something 508 navigation"
          className="accessibility-request__nav"
        >
          <div className="grid-container">
            <button
              type="button"
              className={tabClasses('508')}
              onClick={() => setActiveNavTab('508')}
            >
              508 Requests
            </button>
          </div>
        </nav>
        <div className="grid-container">
          <h1>Medicare Office of Change Initiative 1.3</h1>
          <div className="grid-row grid-gap-lg">
            <div className="grid-col-8">yo</div>
            <div className="grid-col-4">
              <div className="accessibility-request__side-nav">
                <h3>Other request details</h3>
                <dl>
                  <dt className="margin-bottom-1">Submission date</dt>
                  <dd className="margin-0 margin-bottom-2">
                    {DateTime.fromISO(new Date().toISOString()).toLocaleString(
                      DateTime.DATE_FULL
                    )}
                  </dd>
                  <dt className="margin-bottom-1">Business owner</dt>
                  <dd className="margin-0 margin-bottom-2">Shane Clark, OIT</dd>
                  <dt className="margin-bottom-1">Lifecycle ID</dt>
                  <dd className="margin-0 margin-bottom-2">X200943</dd>
                </dl>
              </div>
              <button
                type="button"
                className="accessibility-request__remove-request"
              >
                Remove this request from EASi
              </button>
            </div>
          </div>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default AccessibilityRequestDetailPage;
