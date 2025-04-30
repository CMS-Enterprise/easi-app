import React from 'react';
import Modal from 'react-modal';
import { render } from '@testing-library/react';

import Sidepanel from '.';

describe('Sidepanel', () => {
  let container: HTMLDivElement;

  beforeAll(() => {
    Modal.setAppElement(document.body);
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders without errors', async () => {
    const { findByText, findByTestId } = render(
      <Sidepanel
        ariaLabel="ariaLabel"
        closeModal={() => {}}
        isOpen
        modalHeading="modalHeading"
        testid="testid"
      >
        <div>children</div>
      </Sidepanel>,
      {
        container,
        baseElement: document.body // allows us to query into the portal
      }
    );

    expect(await findByTestId('testid')).toBeInTheDocument();
    expect(await findByText('modalHeading')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { baseElement, findByText, findByTestId } = render(
      <Sidepanel
        ariaLabel="ariaLabel"
        closeModal={() => {}}
        isOpen
        modalHeading="modalHeading"
        testid="testid"
      >
        <div>children</div>
      </Sidepanel>,
      {
        container,
        baseElement: document.body
      }
    );

    await findByTestId('testid');
    await findByText('modalHeading');

    expect(baseElement).toMatchSnapshot();
  });
});
