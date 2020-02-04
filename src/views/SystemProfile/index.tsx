import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/Header';
import HeaderWrapper from 'components/Header/HeaderWrapper';
import SearchBar from 'components/shared/SearchBar';
import SecondaryNav from 'components/shared/SecondaryNav';
import './index.scss';

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

const mockSystemSearch: any[] = [
  { name: 'Apple', acronym: 'APPL' },
  { name: 'Avocado', acronym: 'AVO' },
  { name: 'Banana', acronym: 'BNNA' },
  { name: 'Cherries', acronym: 'CHRS' },
  { name: 'Cranberries', acronym: 'CRNBRY' },
  { name: 'Blackberries', acronym: 'BLKBRY' },
  { name: 'Blueberries', acronym: 'BLUBRY' },
  { name: 'Guava', acronym: 'GUVA' },
  { name: 'Lemon', acronym: 'LEMN' },
  { name: 'Lime', acronym: 'LIME' },
  { name: 'Kiwi', acronym: 'KIWI' },
  { name: 'Watermelon', acronym: 'WTRMLN' },
  { name: 'Papaya', acronym: 'PAPY' },
  { name: 'Pear', acronym: 'Pear' }
];

type SystemProfileProps = {
  match: any;
};

export const SystemProfile = ({ match }: SystemProfileProps) => {
  const onSearch = () => {};
  const getSuggestionValue = (suggestion: any): string => suggestion.name;
  const renderSuggestion = (suggestion: any): string => suggestion.name;

  return (
    <div className="system-profile">
      <Header>
        <HeaderWrapper className="system-profile__search-bar">
          <SearchBar
            name="System search"
            onSearch={onSearch}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            results={mockSystemSearch}
          />
        </HeaderWrapper>

        {mockSystems.length > 0 && (
          <HeaderWrapper className="system-profile__secondary-nav-wrapper">
            <SecondaryNav
              secondaryNavList={mockSystems.slice(0, 10)}
              activeNavItem={match.params.profileId}
            />
          </HeaderWrapper>
        )}
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
