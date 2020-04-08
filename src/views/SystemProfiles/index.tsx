import React from 'react';
import Header from 'components/Header';
import SearchBar from 'components/shared/SearchBar';
import SecondaryNav from 'components/shared/SecondaryNav';
import { useSelector } from 'react-redux';
import { AppState } from 'reducers/rootReducer';
import { RouteComponentProps } from 'react-router-dom';
import UpcomingActions from 'components/shared/UpcomingActions';
import ActionBanner from 'components/shared/ActionBanner';

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

export type SystemProfilesRouterProps = {
  profileId: string;
};

type SystemProfilesProps = RouteComponentProps<SystemProfilesRouterProps> & {
  auth: any;
  searchResults: any;
};

export const SystemProfiles = () => {
  const onSearch = () => {};
  const getSuggestionValue = (suggestion: any): string => suggestion.name;
  const renderSuggestion = (suggestion: any): string => suggestion.name;
  const searchResults = useSelector(
    (state: AppState) => state.search.allSystemShorts
  );

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
        <UpcomingActions timestamp="12/31/19 at 02:45am">
          <ActionBanner
            title="TACO System Request"
            label={<a href="/system/all">View submitted request form</a>}
            helpfulText="Status: The form has been submitted and is being reviewed."
          />
        </UpcomingActions>
      </div>
    </div>
  );
};

export default SystemProfiles;
