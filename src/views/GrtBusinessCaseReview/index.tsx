import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import BusinessCaseReview from 'components/BusinessCaseReview';
import Header from 'components/Header';
import { fetchBusinessCase } from 'types/routines';
import { AppState } from '../../reducers/rootReducer';

export type BusinessCaseRouterProps = {
  businessCaseId: string;
};

export type GrtBusinessCaseReviewProps = RouteComponentProps<
  BusinessCaseRouterProps
> & {
  match: any;
};

export const GrtBusinessCaseReview = ({
  match
}: GrtBusinessCaseReviewProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBusinessCase(match.params.businessCaseId));
  }, [dispatch, match.params.businessCaseId]);

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );
  return (
    <div>
      <Header />
      <div className="grid-container">
        <div className="margin-bottom-7">
          <h1 className="font-heading-xl margin-top-4">CMS Business Case</h1>
          {!businessCase && (
            <h2 className="font-heading-xl">
              Business Case with ID: {match.params.businessCaseId} was not found
            </h2>
          )}
          {businessCase && <BusinessCaseReview values={businessCase} />}
          <hr className="opacity-30" />
          <h2 className="font-heading-xl">What to do after reviewing?</h2>
          <p>Email the requester and:</p>
          <ul className="usa-list">
            <li>Ask them to fill in the business case and submit it</li>
            <li>
              Tell them what to expect after they submit the business case
            </li>
            <li>And how to gjet in touch if they have any questions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GrtBusinessCaseReview;
