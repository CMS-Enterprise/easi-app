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
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/request-description'
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

describe('Business case request description form', () => {
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

    expect(screen.getByTestId('request-description')).toBeInTheDocument();
  });

  it('fills all fields', async () => {
    await renderPage(defaultStore);

    const businessNeedField = screen.getByRole('textbox', {
      name: /business or user need/i
    });
    userEvent.type(businessNeedField, 'My business need');
    await waitFor(() => {
      expect(businessNeedField).toHaveValue('My business need');
    });

    const cmsBenefitField = screen.getByRole('textbox', {
      name: /cms benefit/i
    });
    userEvent.type(cmsBenefitField, 'CMS benefit');
    await waitFor(() => {
      expect(cmsBenefitField).toHaveValue('CMS benefit');
    });

    const currentSolutionSummaryField = screen.getByRole('textbox', {
      name: /current solution/i
    });
    userEvent.type(currentSolutionSummaryField, 'Current Solution');
    await waitFor(() => {
      expect(currentSolutionSummaryField).toHaveValue('Current Solution');
    });

    const priorityAlignmentField = screen.getByRole('textbox', {
      name: /organizational priorities/i
    });
    userEvent.type(priorityAlignmentField, 'Organizational priorities');
    await waitFor(() => {
      expect(priorityAlignmentField).toHaveValue('Organizational priorities');
    });

    const successIndicatorsField = screen.getByRole('textbox', {
      name: /effort is successful/i
    });
    userEvent.type(successIndicatorsField, 'Success indicators');
    await waitFor(() => {
      expect(successIndicatorsField).toHaveValue('Success indicators');
    });
  });

  it('does not run validations', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /Next/i }).click();

    await waitFor(() => {
      expect(
        screen.queryByTestId('formik-validation-errors')
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Alternative analysis/i, level: 2 })
      ).toBeInTheDocument();
    });
  });

  it('does not render mandatory fields message', async () => {
    await renderPage(defaultStore);

    expect(
      screen.queryByTestId('mandatory-fields-alert')
    ).not.toBeInTheDocument();
  });

  it('navigates back one page', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /back/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('general-request-info')).toBeInTheDocument();
    });
  });

  it('navigates to next page', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /next/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('alternative-analysis')).toBeInTheDocument();
    });
  });

  describe('Final Business Case', () => {
    it('renders mandatory fields message', async () => {
      await renderPage(defaultStore, true);

      expect(screen.getByTestId('mandatory-fields-alert')).toBeInTheDocument();
    });

    it('runs validations and renders form errors', async () => {
      window.scrollTo = vi.fn;

      await renderPage(defaultStore, true);

      screen.getByRole('button', { name: /Next/i }).click();

      await waitFor(() => {
        expect(
          screen.getByTestId('formik-validation-errors')
        ).toBeInTheDocument();
      });
    });
  });
});
