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
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/as-is-solution'
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

describe('Business case as is solution form', () => {
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

    expect(screen.getByTestId('as-is-solution')).toBeInTheDocument();
  });

  it('fills all fields', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    const titleField = screen.getByRole('textbox', {
      name: /title/i
    });
    userEvent.type(titleField, 'As is solution title');
    expect(titleField).toHaveValue('As is solution title');

    const summaryField = screen.getByRole('textbox', {
      name: /summary/i
    });
    userEvent.type(summaryField, 'As is solution summary');
    expect(summaryField).toHaveValue('As is solution summary');

    const prosField = screen.getByRole('textbox', {
      name: /pros/i
    });
    userEvent.type(prosField, 'As is solution pros');
    expect(prosField).toHaveValue('As is solution pros');

    const consField = screen.getByRole('textbox', {
      name: /cons/i
    });
    userEvent.type(consField, 'As is solution cons');
    expect(consField).toHaveValue('As is solution cons');

    // Skip Estimated Lifecycle Costs

    const costSavingsField = screen.getByRole('textbox', {
      name: /cost savings/i
    });
    userEvent.type(costSavingsField, 'As is solution cost savings');
    expect(costSavingsField).toHaveValue('As is solution cost savings');
  });

  it('does not render mandatory fields message', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    expect(
      screen.queryByTestId('mandatory-fields-alert')
    ).not.toBeInTheDocument();
  });

  it('navigates back one page', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    screen.getByRole('button', { name: /back/i }).click();

    await waitForPageLoad();

    expect(screen.getByTestId('request-description')).toBeInTheDocument();
  });

  it('navigates to next page', async () => {
    renderPage(defaultStore);
    await waitForPageLoad();

    screen.getByRole('button', { name: /next/i }).click();

    await waitForPageLoad();

    expect(screen.getByTestId('preferred-solution')).toBeInTheDocument();
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
