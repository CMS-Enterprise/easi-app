import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from 'components/Header';
import ActionBanner from 'components/shared/ActionBanner';
import SearchBar from 'components/shared/SearchBar';
import SecondaryNav from 'components/shared/SecondaryNav';
import UpcomingActions from 'components/shared/UpcomingActions';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntakes, fetchSystemShorts } from 'types/routines';

const mockSystems: any[] = [
  { id: 'All', name: 'All', slug: 'all', link: '/system/all' },
  {
    id: '1',
    name: 'System1',
    acronym: 'SYS1',
    slug: 'system1',
    link: '/system/system1'
  },
  {
    id: '2',
    name: 'System2',
    acronym: 'SYS2',
    slug: 'system2',
    link: '/system/system2'
  },
  {
    id: '3',
    name: 'System3',
    acronym: 'SYS3',
    slug: 'system3',
    link: '/system/system3'
  },
  {
    id: '4',
    name: 'System4',
    acronym: 'SYS4',
    slug: 'system4',
    link: '/system/system4'
  },
  {
    id: '5',
    name: 'System5',
    acronym: 'SYS5',
    slug: 'system5',
    link: '/system/system5'
  }
];

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

        {mockSystems.length > 0 && (
          <div className="system-profile__secondary-nav-wrapper">
            <SecondaryNav
              secondaryNavList={mockSystems.slice(0, 10)}
              activeNavItem="all"
            />
          </div>
        )}
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
                />
              );
            })}
        </UpcomingActions>
      </div>
    </div>
  );
};

export default SystemProfiles;
