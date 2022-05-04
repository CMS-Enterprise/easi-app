import React from 'react';
import { render } from '@testing-library/react';

import RequestCardTestScore from '.';

describe('RequestCardTestScore', () => {
  const date = '01/01/2022';
  it('renders score 100%', () => {
    const { asFragment, getByText, container } = render(
      <RequestCardTestScore scorePct={100} date={date} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText(/100%/i)).toBeVisible();
    expect(container.getElementsByClassName('text-mint').length).toBe(1);
  });
  it('renders score < 100%', () => {
    const { getByText, container } = render(
      <RequestCardTestScore scorePct={98} date={date} />
    );
    expect(getByText(/98%/i)).toBeVisible();
    expect(container.getElementsByClassName('text-orange').length).toBe(1);
  });
});
