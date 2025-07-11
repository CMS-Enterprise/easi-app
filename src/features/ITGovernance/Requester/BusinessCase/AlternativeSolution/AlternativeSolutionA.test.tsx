import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessCase from 'features/ITGovernance/Requester/BusinessCase';
import { SystemIntakeStep } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import { getGovernanceTaskListQuery } from 'tests/mock/systemIntake';

import {
  businessCaseInitialData,
  defaultProposedSolution
} from 'data/businessCase';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

const SYSTEM_INTAKE_ID = '943916ee-7a30-4213-990e-02c4fb97382a';

const renderPage = async (
  store: any,
  systemIntakeId: string = SYSTEM_INTAKE_ID,
  step: SystemIntakeStep = SystemIntakeStep.DRAFT_BUSINESS_CASE,
  alternative:
    | 'alternative-solution-a'
    | 'alternative-solution-b'
    | 'alternative-analysis' = 'alternative-solution-a'
) => {
  render(
    <MemoryRouter
      initialEntries={[
        `/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/${alternative}`
      ]}
    >
      <Provider store={store}>
        <VerboseMockedProvider
          mocks={[
            getGovernanceTaskListQuery({
              id: systemIntakeId,
              step
            })
          ]}
          addTypename={false}
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

describe('Business case alternative a solution', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
        systemIntakeId: SYSTEM_INTAKE_ID
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

    expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
  });

  it('adds alternative a and navigates to it', async () => {
    await renderPage(defaultStore);

    userEvent.click(
      screen.getByRole('button', { name: /Finish alternative A/i })
    );

    await waitFor(() => {
      expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
    });
  });

  describe('with alternative b', () => {
    const withAlternativeBStore = mockStore({
      auth: {
        euaId: 'AAAA'
      },
      businessCase: {
        form: {
          ...businessCaseInitialData,
          id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
          systemIntakeId: SYSTEM_INTAKE_ID,
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

    it('hides adding alternative b when it exists already', async () => {
      await renderPage(
        withAlternativeBStore,
        undefined,
        undefined,
        'alternative-analysis'
      );

      expect(
        screen.queryByRole('button', { name: /Add alternative B/i })
      ).not.toBeInTheDocument();
    });

    it('navigates forward to alternative b', async () => {
      await renderPage(
        withAlternativeBStore,
        undefined,
        undefined,
        'alternative-solution-b'
      );

      userEvent.click(
        screen.getByRole('button', { name: /Finish alternative B/i })
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('alternative-solution-b')
        ).toBeInTheDocument();
      });
    });
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
          systemIntakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2'
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
      await renderPage(
        bizCaseFinalStore,
        'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
        SystemIntakeStep.FINAL_BUSINESS_CASE
      );

      // Fill one field so we can trigger validation errors
      const titleField = screen.getByRole('textbox', {
        name: /title/i
      });
      userEvent.type(titleField, 'Alternative A solution title');
      expect(titleField).toHaveValue('Alternative A solution title');

      userEvent.click(
        screen.getByRole('button', { name: /Finish alternative A/i })
      );

      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();
    });
  });
});
