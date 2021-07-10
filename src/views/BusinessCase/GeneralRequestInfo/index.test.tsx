import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { businessCaseInitialData } from 'data/businessCase';
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

const waitForPageLoad = async () => {
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
};

const renderPage = (store: any) =>
  render(
    <MemoryRouter
      initialEntries={[
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/general-request-info'
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

describe('Business case general request info form', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        id: '75746af8-9a9b-4558-a375-cf9848eb2b0d'
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

    expect(screen.getByTestId('general-request-info')).toBeInTheDocument();
  });

  it('fills all fields', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    const projectNameField = screen.getByRole('textbox', {
      name: /Project Name/i
    });
    userEvent.type(projectNameField, 'Test Project 1');
    expect(projectNameField).toHaveValue('Test Project 1');

    const requesterField = screen.getByRole('textbox', {
      name: /^Requester$/i
    });
    userEvent.type(requesterField, 'John Doe');
    expect(requesterField).toHaveValue('John Doe');

    const businessOwnerField = screen.getByRole('textbox', {
      name: /Business Owner/i
    });
    userEvent.type(businessOwnerField, 'Sally Doe');
    expect(businessOwnerField).toHaveValue('Sally Doe');

    const phoneNumberField = screen.getByRole('textbox', {
      name: /Phone Number/i
    });
    userEvent.type(phoneNumberField, '1234567890');
    expect(phoneNumberField).toHaveValue('1234567890');
  });

  it('does not run validations', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    screen.getByRole('button', { name: /Next/i }).click();

    expect(
      screen.queryByTestId('formik-validation-errors')
    ).not.toBeInTheDocument();

    await waitForPageLoad();

    expect(
      screen.getByRole('heading', { name: /Request description/i })
    ).toBeInTheDocument();
  });

  it('does not render mandatory fields message', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    expect(
      screen.queryByTestId('mandatory-fields-alert')
    ).not.toBeInTheDocument();
  });

  describe('BIZ_CASE_FINAL_NEEDED', () => {
    const storeWithFinalBizCase = mockStore({
      auth: {
        euaId: 'AAAA'
      },
      businessCase: {
        form: {
          ...businessCaseInitialData,
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
          systemIntakeStatus: 'BIZ_CASE_FINAL_NEEDED'
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

    it('renders mandatory fields message', async () => {
      renderPage(storeWithFinalBizCase);
      await waitForPageLoad();

      expect(screen.getByTestId('mandatory-fields-alert')).toBeInTheDocument();
    });

    it('runs validations and renders form errors', async () => {
      window.scrollTo = jest.fn();

      renderPage(storeWithFinalBizCase);
      await waitForPageLoad();

      screen.getByRole('button', { name: /Next/i }).click();

      await waitForPageLoad();

      expect(
        screen.getByTestId('formik-validation-errors')
      ).toBeInTheDocument();
    });
  });
});
