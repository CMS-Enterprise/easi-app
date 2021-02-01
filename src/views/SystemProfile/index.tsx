import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/Header';
import SearchBar from 'components/shared/SearchBar';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemShorts } from 'types/routines';

import './index.scss';

export type SystemProfileRouterProps = {
  profileId: string;
};

export const SystemProfile = () => {
  const onSearch = () => {};
  const getSuggestionValue = (suggestion: any): string => suggestion.name;
  const renderSuggestion = (suggestion: any): string => suggestion.name;
  const dispatch = useDispatch();
  const searchResults = useSelector(
    (state: AppState) => state.search.systemShorts
  );

  useEffect(() => {
    dispatch(fetchSystemShorts());
  }, [dispatch]);

  return (
    <div className="system-profile">
      <Header>
        <div className="system-profile__search-bar">
          <SearchBar
            name="System search"
            onSearch={onSearch}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            results={searchResults}
          />
        </div>
      </Header>
      <div className="grid-container">
        <div className="grid-col-8">
          <div className="grid-col-8">
            <h1 className="system-profile__acronym">CATQ</h1>
            <h2 className="system-profile__name">
              Center for Automation Technology Quality
            </h2>
            <h3 className="system-profile__heading">Description</h3>
            <p className="system-profile__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <hr className="system-profile__hr" />
          {/* System Info - Can potentially be moved to its own component if it is reused elsewhere */}
          <div className="system-profile__system-info">
            <h3 className="system-profile__heading">System Information</h3>
            <div className="system-profile__info-list">
              <dl className="system-profile__info-item">
                <dt className="system-profile__info-label">Datapoint 1</dt>
                <dd className="system-profile__info-data">Some Value Here</dd>
              </dl>
              <dl className="system-profile__info-item">
                <dt className="system-profile__info-label">Datapoint 2</dt>
                <dd className="system-profile__info-data">Fancy information</dd>
              </dl>
              <dl className="system-profile__info-item">
                <dt className="system-profile__info-label">Datapoint 3</dt>
                <dd className="system-profile__info-data">Fanciest stuff</dd>
              </dl>
              <dl className="system-profile__info-item">
                <dt className="system-profile__info-label">Datapoint 4</dt>
                <dd className="system-profile__info-data">
                  More fancy information
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SystemProfile);
