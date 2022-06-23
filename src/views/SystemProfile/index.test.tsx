import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';

import { query } from 'data/mock/systemProfile';

import SystemProfile from './index';

describe('System Profile parent request', () => {
  it('matches snapshot', async () => {
    const { /* asFragment, */ getByText, getAllByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/home']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={[query]} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => getByTestId('page-loading'));
    // skip due to parsed datetime difference in ci test
    // expect(asFragment()).toMatchSnapshot();
    expect(getByText('CMS.gov')).toBeInTheDocument();
    expect(getAllByText('Jane Doe')[0]).toBeInTheDocument();
  });
});

describe('System profile description is expandable', () => {
  beforeEach(() => {
    // Fill in heights for description text element
    // https://github.com/testing-library/react-testing-library/issues/353
    const el = HTMLElement.prototype;
    Object.defineProperty(el, 'offsetHeight', {
      configurable: true,
      value: 300
    });
    Object.defineProperty(el, 'scrollHeight', {
      configurable: true,
      value: 400
    });
  });

  it('shows read more & less', async () => {
    const { getByText, findByTestId } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/home']}>
        <Route path="/systems/:systemId/:subinfo">
          <MockedProvider mocks={[query]} addTypename={false}>
            <SystemProfile />
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const loading = await findByTestId('page-loading');
    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    });

    const readMore = getByText(/read more/i);
    await waitFor(() => {
      expect(readMore).toBeInTheDocument();
    });

    fireEvent.click(readMore);

    await waitFor(() => {
      expect(getByText(/read less/i)).toBeInTheDocument();
    });
  });
});
