import React from 'react';
import { render } from '@testing-library/react';

import ReviewRow from './index';

describe('The Review Row component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <ReviewRow className="test-class-name">
        <div id="testid" />
      </ReviewRow>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
