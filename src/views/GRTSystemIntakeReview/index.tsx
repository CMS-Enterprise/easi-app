import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake } from 'types/routines';

export const GRTSystemIntakeReview = () => {
  const { systemId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
  }, [dispatch, systemId]);
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        <div className="system-intake__review margin-bottom-7">
          <h1 className="font-heading-xl margin-top-4">CMS System Request</h1>
          {!systemIntake && (
            <h2 className="font-heading-xl">
              System intake with ID: {systemId} was not found
            </h2>
          )}
          {systemIntake && <SystemIntakeReview systemIntake={systemIntake} />}
        </div>
      </MainContent>
      <div className="bg-gray-5">
        <MainContent className="grid-container">
          <h1 className="font-heading-xl">Next steps</h1>
        </MainContent>
      </div>
    </div>
  );
};

export default GRTSystemIntakeReview;
