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
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/alternative-solution-a'
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

describe('Business case alternative a solution', () => {
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

    expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
  });

  it('does not run validations', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /Finish Alternative A/i }).click();

    await waitFor(() => {
      expect(
        screen.queryByTestId('formik-validation-errors')
      ).not.toBeInTheDocument();
    });
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

  it('navigates back to alternative analysis', async () => {
    await renderPage(defaultStore);

    screen.getByTestId('save-and-return-button').click();

    await waitFor(() => {
      expect(screen.getByTestId('alternative-analysis')).toBeInTheDocument();
    });
  });

  it('navigates to alternative analysis page after finishing', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /Finish Alternative A/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('alternative-analysis')).toBeInTheDocument();
    });
  });

  // it('adds alternative b and navigates to it', async () => {
  //   await renderPage(defaultStore);

  //   screen.getByRole('button', { name: /alternative b/i }).click();

  //   expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
  // });

  // it('navigates forward to review', async () => {
  //   await renderPage(defaultStore);

  //   screen.getByRole('button', { name: /next/i }).click();

  //   expect(screen.getByTestId('business-case-review')).toBeInTheDocument();
  // });

  // describe('with alternative b', () => {
  //   const withAlternativeBStore = mockStore({
  //     auth: {
  //       euaId: 'AAAA'
  //     },
  //     businessCase: {
  //       form: {
  //         ...businessCaseInitialData,
  //         id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
  //         systemIntakeId: '943916ee-7a30-4213-990e-02c4fb97382a',
  //         alternativeB: {
  //           ...defaultProposedSolution,
  //           title: 'Alt B'
  //         }
  //       },
  //       isLoading: false,
  //       isSaving: false,
  //       error: null
  //     },
  //     action: {
  //       isPosting: false,
  //       error: null,
  //       actions: []
  //     }
  //   });
  //   it('hides adding alternative b when it exists already', async () => {
  //     await renderPage(withAlternativeBStore);
  //     expect(
  //       screen.queryByRole('button', { name: /alternative b/i })
  //     ).not.toBeInTheDocument();
  //   });
  //   it('navigates forward to alternative b', async () => {
  //     await renderPage(withAlternativeBStore);
  //     screen.getByRole('button', { name: /next/i }).click();
  //     expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
  //   });
  // });

  describe('Final Business Case', () => {
    it('does not render draft business case fields message', async () => {
      await renderPage(defaultStore, true);

      expect(
        screen.queryByTestId('draft-business-case-fields-alert')
      ).not.toBeInTheDocument();
    });

    it('runs validations and redners form errors', async () => {
      window.scrollTo = vi.fn;

      await renderPage(defaultStore, true);

      screen.getByRole('button', { name: /Finish Alternative A/i }).click();

      await waitFor(() => {
        expect(
          screen.getByTestId('formik-validation-errors')
        ).toBeInTheDocument();
      });
    });
  });
});
