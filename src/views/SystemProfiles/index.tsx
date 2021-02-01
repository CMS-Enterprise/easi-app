import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from 'components/Header';
import ActionBanner from 'components/shared/ActionBanner';
import SearchBar from 'components/shared/SearchBar';
import UpcomingActions from 'components/shared/UpcomingActions';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes, fetchSystemShorts } from 'types/routines';

export const SystemProfiles = () => {
  const onSearch = () => {};
  const getSuggestionValue = (suggestion: any): string => suggestion.name;
  const renderSuggestion = (suggestion: any): string => suggestion.name;
  const intakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );
  const searchResults = useSelector(
    (state: AppState) => state.search.systemShorts
  );
  const timeStamp = useSelector(
    (state: AppState) => state.systemIntakes.loadedTimestamp
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSystemIntakes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSystemShorts());
  }, [dispatch]);

  const getStatusNotification = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Status: The form has been submitted and is being reviewed.';
      case 'REVIEWED':
        return 'Status: Request Form has been reviewed. Prepare your business case.';
      default:
        return '';
    }
  };

  const getButtonLabel = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'View submitted request form';
      case 'REVIEWED':
        return 'Begin Business Case';
      default:
        return '';
    }
  };

  return (
    <div>
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
        <UpcomingActions timestamp={timeStamp}>
          {intakes
            .filter(intake => ['SUBMITTED', 'REVIEWED'].includes(intake.status))
            .map(intake => {
              return (
                <ActionBanner
                  key={intake.id}
                  title={`${intake.requestName} Intake Request`}
                  helpfulText={getStatusNotification(intake.status)}
                  onClick={() => {}}
                  buttonUnstyled={intake.status === 'SUBMITTED'}
                  label={getButtonLabel(intake.status)}
                  requestType="NEW"
                />
              );
            })}
        </UpcomingActions>
      </div>
    </div>
  );
};

export default SystemProfiles;
