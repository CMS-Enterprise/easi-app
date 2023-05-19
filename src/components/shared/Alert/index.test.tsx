import React from 'react';
import { render } from '@testing-library/react';

import Alert from './index';

describe('The Alert component', () => {
  it('renders a closable information alert', async () => {
    const { getByRole } = render(
      <Alert type="info" isClosable heading="Info Alert">
        This is information
      </Alert>
    );

    expect(getByRole('button', { name: /Close Button/ })).toBeInTheDocument();
  });

  it('renders a closable default success alert', async () => {
    const { getByRole } = render(
      <Alert type="success" heading="Success Alert">
        This is successful
      </Alert>
    );

    expect(getByRole('button', { name: /Close Button/ })).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <Alert type="info" isClosable heading="Info Alert">
        This is information
      </Alert>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
