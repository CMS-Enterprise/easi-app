import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import PrepareTrbConsultMeeting from '.';

describe('Trb Help Prepare Consult Meeting', () => {
  it('renders', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <PrepareTrbConsultMeeting />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
