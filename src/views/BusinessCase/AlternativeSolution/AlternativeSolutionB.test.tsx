import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import {
  businessCaseInitialData,
  defaultProposedSolution
} from 'data/businessCase';
import BusinessCase from 'views/BusinessCase';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

window.scrollTo = jest.fn();

const waitForPageLoad = async () => {
  await waitFor(() => {
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
  });
};

const renderPage = (store: any) =>
  render(
    <MemoryRouter
      initialEntries={[
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/alternative-solution-b'
      ]}
    >
      <Provider store={store}>
        <MockedProvider>
          <Route
            path="/business/:businessCaseId/:formPage"
            component={BusinessCase}
          />
        </MockedProvider>
      </Provider>
    </MemoryRouter>
  );

describe('Business case alternative b solution', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
        alternativeB: {
          ...defaultProposedSolution,
          title: 'Alt B'
        }
      },
      isLoading: false,
      isSaving: false,
      error: null
    },
    action: {
      isPosting: false,
      error: null,
      actions: []
    }
  });

  it('renders without errors', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
  });

  it('navigates back a page', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    screen.getByRole('button', { name: /back/i }).click();

    expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
  });

  it('navigates forward to review', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    screen.getByRole('button', { name: /next/i }).click();

    expect(screen.getByTestId('business-case-review')).toBeInTheDocument();
  });

  it('removes alternative b', async () => {
    window.confirm = jest.fn(() => true);
    renderPage(defaultStore);
    await waitForPageLoad();

    screen.getByRole('button', { name: /remove alternative b/i }).click();
    expect(window.confirm).toBeCalled();
    expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
  });

  describe('BIZ_CASE_FINAL_NEEDED', () => {
    const bizCaseFinalStore = mockStore({
      auth: {
        euaId: 'AAAA'
      },
      businessCase: {
        form: {
          ...businessCaseInitialData,
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
          systemIntakeStatus: 'BIZ_CASE_FINAL_NEEDED',
          alternativeB: defaultProposedSolution
        },
        isLoading: false,
        isSaving: false,
        error: null
      },
      action: {
        isPosting: false,
        error: null,
        actions: []
      }
    });

    it('renders validation errors', async () => {
      renderPage(bizCaseFinalStore);
      await waitForPageLoad();

      // Fill one field so we can trigger validation errors
      const titleField = screen.getByRole('textbox', {
        name: /title/i
      });
      userEvent.type(titleField, 'Alternative B solution title');
      expect(titleField).toHaveValue('Alternative B solution title');

      screen.getByRole('button', { name: /next/i }).click();
      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();
    });
  });
});
