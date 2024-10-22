import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

// import i18next from 'i18next';
// import { HelpLinkType } from 'i18n/en-US/systemWorkspace';
import HelpCardGroup from './SystemCardGroup';

describe('Help Links component', () => {
  // const helpCards = i18next.t<HelpLinkType[]>(
  //   'systemWorkspace:helpLinks.links',
  //   {
  //     returnObjects: true
  //   }
  // );

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpCardGroup cards={[]} linkSearchQuery="linkCedarSystemId=1" />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
