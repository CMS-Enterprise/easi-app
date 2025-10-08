import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';

import IntakeReview from './index';

describe('The GRT intake review view', () => {
  let dateSpy: any;
  let mathRandomSpy: any;
  beforeAll(() => {
    // September 30, 2020
    dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => 1601449200000);
    // Mock Math.random to return consistent values for tooltip IDs
    mathRandomSpy = vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });

  afterAll(() => {
    dateSpy.mockRestore();
    mathRandomSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery()]}
        >
          <MessageProvider>
            <IntakeReview systemIntake={systemIntake} />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('intake-review')).toBeInTheDocument();
  });

  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/intake-request`]}
      >
        <MockedProvider
          mocks={[getSystemIntakeQuery(), getSystemIntakeContactsQuery()]}
        >
          <Route path={['/it-governance/:systemId/intake-request']}>
            <MessageProvider>
              <IntakeReview systemIntake={systemIntake} />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(asFragment()).toMatchSnapshot();
  });
});
