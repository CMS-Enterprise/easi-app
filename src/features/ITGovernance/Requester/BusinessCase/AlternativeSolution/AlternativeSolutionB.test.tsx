import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  act,
  render,
  screen,
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

window.matchMedia = (): any => ({
  addListener: () => {},
  removeListener: () => {}
});

window.scrollTo = vi.fn;

const defaultMocks = [
  getGovernanceTaskListQuery({
    id: '34ded286-02fa-4457-b1a5-0fc6ec00ecf5'
  })
];

const renderPage = async (store: any, mocks: MockedResponse[]) => {
  render(
    <MemoryRouter
      initialEntries={[
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/alternative-solution-b'
      ]}
    >
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
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
        systemIntakeId: '34ded286-02fa-4457-b1a5-0fc6ec00ecf5',
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
    await renderPage(defaultStore, defaultMocks);
    expect(screen.getByTestId('alternative-solution-b')).toBeInTheDocument();
  });

  it('navigates back a page', async () => {
    await renderPage(defaultStore, defaultMocks);

    userEvent.click(screen.getByRole('button', { name: /back/i }));

    await screen.findByTestId('alternative-solution-a');
    expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
  });

  it('navigates forward to review', async () => {
    await renderPage(defaultStore, defaultMocks);

    userEvent.click(screen.getByRole('button', { name: /next/i }));

    await screen.findByTestId('business-case-review');
    expect(screen.getByTestId('business-case-review')).toBeInTheDocument();
  });

  it('removes alternative b', async () => {
    window.confirm = vi.fn(() => true);
    await renderPage(defaultStore, defaultMocks);

    userEvent.click(
      screen.getByRole('button', { name: /remove alternative b/i })
    );

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
          systemIntakeId: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
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
      const repeatedMock = getGovernanceTaskListQuery({
        id: 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2',
        step: SystemIntakeStep.FINAL_BUSINESS_CASE
      });

      await renderPage(bizCaseFinalStore, [repeatedMock, repeatedMock]);

      const titleField = screen.getByRole('textbox', { name: /title/i });
      await userEvent.type(titleField, 'Something filled');

      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: /next/i }));
      });

      expect(
        await screen.findByTestId('formik-validation-errors')
      ).toBeInTheDocument();
    });
  });
});
