import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';

const RequestDecision = () => {
  const { systemId } = useParams();
  return (
    <PageWrapper className="governance-task-list">
      <Header />
      <MainContent className="grid-container margin-bottom-7">
        <div className="grid-row">
          <BreadcrumbNav className="margin-y-2 tablet:grid-col-12">
            <li>
              <Link to="/">Home</Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>
              <Link to={`/governance-task-list/${systemId}`}>
                Get governance approval
              </Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li aria-current="location">Decision and next steps</li>
          </BreadcrumbNav>
        </div>
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <h1 className="font-heading-2xl margin-top-4">
              Decision and next steps
            </h1>
          </div>
          <div className="tablet:grid-col-1" />
          <div className="tablet:grid-col-2" />
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default RequestDecision;
