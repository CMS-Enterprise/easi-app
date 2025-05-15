import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import BusinessCase from 'features/ITGovernance/Requester/BusinessCase';
import { SystemIntakeStep } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import {
  getGovernanceTaskListQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { businessCaseInitialData } from 'data/businessCase';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

const renderPage = async (store: any, isFinal?: boolean) => {
  render(
    <MemoryRouter
      initialEntries={[
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/alternative-analysis'
      ]}
    >
      <Provider store={store}>
        <VerboseMockedProvider
          mocks={[
            getGovernanceTaskListQuery({
              step: isFinal
                ? SystemIntakeStep.FINAL_BUSINESS_CASE
                : SystemIntakeStep.DRAFT_BUSINESS_CASE
            })
          ]}
        >
          <Route
            path="/business/:businessCaseId/:formPage"
            component={BusinessCase}
          />
        </VerboseMockedProvider>
      </Provider>
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));
};

describe('Business case alternative analysis form', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        systemIntakeId: systemIntake.id,
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
    await renderPage(defaultStore);

    await waitFor(() => {
      expect(screen.getByTestId('alternative-analysis')).toBeInTheDocument();
    });
  });

  it('renders draft business case fields message', async () => {
    await renderPage(defaultStore);

    expect(
      screen.getByTestId('draft-business-case-fields-alert')
    ).toBeInTheDocument();
  });

  it('all three add solution buttons are present', async () => {
    await renderPage(defaultStore);

    expect(
      screen.getByRole('button', { name: /Add preferred solution/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Add alternative A/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Add alternative B/i })
    ).toBeInTheDocument();
  });

  it('solution buttons navigate to correct solution', async () => {
    await renderPage(defaultStore);

    // Navigate to Preferred Solution
    screen.getByRole('button', { name: /Add preferred solution/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('preferred-solution')).toBeInTheDocument();
    });

    // Navigate back to Alternative Analysis
    screen.getByTestId('save-and-return-button').click();

    await waitFor(() => {
      expect(screen.getByTestId('alternative-analysis')).toBeInTheDocument();
    });

    // Navigate to Alternative A
    screen.getByRole('button', { name: /Add alternative A/i }).click();

    expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();

    // Navigate back to Alternative Analysis
    screen.getByTestId('save-and-return-button').click();

    await waitFor(() => {
      expect(screen.getByTestId('alternative-analysis')).toBeInTheDocument();
    });

    // Navigate to Alternative B
    screen.getByRole('button', { name: /Add alternative B/i }).click();

    expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
  });

  it('navigates to the previous page when "Back" is clicked', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /back/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('request-description')).toBeInTheDocument();
    });
  });

  it('next button is not disabled', async () => {
    await renderPage(defaultStore);

    expect(screen.getByRole('button', { name: /Next/i })).not.toBeDisabled();
  });

  describe('Final Business Case', () => {
    it('does not render draft business case fields message', async () => {
      await renderPage(defaultStore, true);

      expect(
        screen.queryByTestId('draft-business-case-fields-alert')
      ).not.toBeInTheDocument();
    });

    it('Next button is disabled when solutions are not filled out', async () => {
      window.scrollTo = vi.fn;

      await renderPage(defaultStore, true);

      expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
    });
  });
});
