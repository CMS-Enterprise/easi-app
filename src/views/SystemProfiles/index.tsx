import React, { useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import Header from 'components/Header';
import SearchBar from 'components/shared/SearchBar';
import SecondaryNav from 'components/shared/SecondaryNav';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'reducers/rootReducer';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import UpcomingActions from 'components/shared/UpcomingActions';
import ActionBanner from 'components/shared/ActionBanner';
import { getAllSystemShorts } from 'actions/searchActions';
import { fetchSystemIntakes } from 'actions/systemIntakeActions';

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

export const SystemProfiles = ({ auth }: SystemProfilesProps) => {
  const onSearch = () => {};
  const getSuggestionValue = (suggestion: any): string => suggestion.name;
  const renderSuggestion = (suggestion: any): string => suggestion.name;
  const intakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );

  const searchResults = useSelector(
    (state: AppState) => state.search.allSystemShorts
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const getSystemIntakes = async (): Promise<void> => {
      dispatch(fetchSystemIntakes(await auth.getAccessToken()));
    };
    getSystemIntakes();
  }, [auth, dispatch]);

  useEffect(() => {
    const fetchSystemShorts = async (): Promise<void> => {
      dispatch(getAllSystemShorts(await auth.getAccessToken()));
    };
    fetchSystemShorts();
  }, [auth, dispatch]);

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
          {intakes.map(intake => {
            return (
              <ActionBanner
                title={intake.projectName}
                helpfulText="Status: yada yada yada"
                label={<a href="/system/all">View submitted request form</a>}
              />
            );
          })}
        </UpcomingActions>
      </div>
    </div>
  );
};

export default withRouter(withAuth(SystemProfiles));
