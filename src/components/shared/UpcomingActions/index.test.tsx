import React from 'react';
import { render } from '@testing-library/react';

import UpcomingActions from './index';

describe('The Action Banner component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <button type="button">Thing</button>
        <div className="Test">blah</div>
        <div className="Test">foobar</div>
      </UpcomingActions>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
