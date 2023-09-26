import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import ServiceAlert from '.';

describe('ServiceAlert banner', () => {
  it('does not render on non-designated route', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/trb/start']}>
        <Route path="/trb/start">
          <ServiceAlert />
        </Route>
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/help']}>
        <Route path="/help">
          <ServiceAlert />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
