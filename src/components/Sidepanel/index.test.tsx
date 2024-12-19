import React from 'react';
import Modal from 'react-modal';
import { render, waitFor } from '@testing-library/react';

import Sidepanel from '.';

describe('Sidepanel', () => {
  beforeAll(() => {
    Modal.setAppElement(document.body);
  });

  it('renders without errors', async () => {
    const { getByText, getByTestId } = render(
      <Sidepanel
        ariaLabel="ariaLabel"
        closeModal={() => {}}
        isOpen
        modalHeading="modalHeading"
        testid="testid"
      >
        <div>children</div>
      </Sidepanel>,
      { container: document.body }
    );

    expect(getByTestId('testid')).toBeInTheDocument();
    expect(getByText('modalHeading')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment, getByText, getByTestId } = render(
      <Sidepanel
        ariaLabel="ariaLabel"
        closeModal={() => {}}
        isOpen
        modalHeading="modalHeading"
        testid="testid"
      >
        <div>children</div>
      </Sidepanel>,
      { container: document.body }
    );

    await waitFor(() => {
      expect(getByTestId('testid')).toBeInTheDocument();
      expect(getByText('modalHeading')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
