import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import BusinessCaseReview from 'components/BusinessCaseReview';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import { fetchBusinessCase } from 'types/routines';

import { AppState } from '../../reducers/rootReducer';

export type BusinessCaseRouterProps = {
  businessCaseId: string;
};

export const GrtBusinessCaseReview = () => {
  const dispatch = useDispatch();
  const { businessCaseId } = useParams();

  useEffect(() => {
    dispatch(fetchBusinessCase(businessCaseId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  return (
    <div>
      <Header />
      <MainContent className="margin-bottom-7">
        <div className="grid-container">
          <h1 className="font-heading-xl margin-top-4">CMS Business Case</h1>
          {!businessCase && (
            <h2 className="font-heading-xl">
              Business Case with ID: {businessCaseId} was not found
            </h2>
          )}
        </div>
        {businessCase && <BusinessCaseReview values={businessCase} />}
      </MainContent>
    </div>
  );
};

export default GrtBusinessCaseReview;
