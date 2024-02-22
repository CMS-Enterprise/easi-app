import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import {
  businessCaseInitialData,
  defaultProposedSolution
} from 'data/businessCase';
import { getGovernanceTaskListQuery } from 'data/mock/systemIntake';
import { SystemIntakeStep } from 'types/graphql-global-types';
import BusinessCase from 'views/BusinessCase';

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

window.scrollTo = vi.fn;

const renderPage = async (store: any, mocks?: MockedResponse[]) => {
  render(
    <MemoryRouter
      initialEntries={[
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/alternative-solution-a'
      ]}
    >
      <Provider store={store}>
        <MockedProvider mocks={mocks}>
          <Route
            path="/business/:businessCaseId/:formPage"
            component={BusinessCase}
          />
        </MockedProvider>
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
        systemIntakeId: '943916ee-7a30-4213-990e-02c4fb97382a'
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

  it('navigates back a page', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /back/i }).click();

    expect(screen.getByTestId('preferred-solution')).toBeInTheDocument();
  });

  it('adds alternative b and navigates to it', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /alternative b/i }).click();

    expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
  });

  it('navigates forward to review', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /next/i }).click();

    expect(screen.getByTestId('business-case-review')).toBeInTheDocument();
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
          systemIntakeId: '943916ee-7a30-4213-990e-02c4fb97382a',
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
      await renderPage(withAlternativeBStore);

      expect(
        screen.queryByRole('button', { name: /alternative b/i })
      ).not.toBeInTheDocument();
    });

    it('navigates forward to alternative b', async () => {
      await renderPage(withAlternativeBStore);

      screen.getByRole('button', { name: /next/i }).click();

      expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
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
      await renderPage(bizCaseFinalStore, [
        getGovernanceTaskListQuery({
          step: SystemIntakeStep.FINAL_BUSINESS_CASE
        })
      ]);

      // Fill one field so we can trigger validation errors
      const titleField = screen.getByRole('textbox', {
        name: /title/i
      });
      userEvent.type(titleField, 'Alternative A solution title');
      expect(titleField).toHaveValue('Alternative A solution title');

      screen.getByRole('button', { name: /next/i }).click();
      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();
    });
  });
});
