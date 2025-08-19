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
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/general-request-info'
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

describe('Business case general request info form', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    },
    businessCase: {
      form: {
        ...businessCaseInitialData,
        systemIntakeId: systemIntake.id,
        id: '75746af8-9a9b-4558-a375-cf9848eb2b0d',
        requester: {
          name: 'John Doe'
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
    await renderPage(defaultStore);

    expect(screen.getByTestId('general-request-info')).toBeInTheDocument();
  });

  it('fills all fields', async () => {
    const user = userEvent.setup();
    await renderPage(defaultStore);

    const requestNameField = screen.getByRole('textbox', {
      name: /Contract \/ request title/i
    });
    await user.type(requestNameField, 'Test Project 1');
    expect(requestNameField).toHaveValue('Test Project 1');

    const projectAcronymField = screen.getByRole('textbox', {
      name: /Contract \/ request acronym/i
    });
    await user.type(projectAcronymField, 'TP1');
    expect(projectAcronymField).toHaveValue('TP1');

    const requesterField = screen.getByRole('textbox', {
      name: /Requester name/i
    });

    expect(requesterField).toBeDisabled();

    await user.type(requesterField, 'John Doe');
    expect(requesterField).toHaveValue('John Doe');

    const businessOwnerField = screen.getByTestId('cedar-contact-select');

    await user.type(businessOwnerField, 'Jane McModel');
    await user.keyboard('[Enter]');

    expect(businessOwnerField).toHaveValue('Jane McModel');

    const phoneNumberField = screen.getByRole('textbox', {
      name: /Phone Number/i
    });
    await user.type(phoneNumberField, '1234567890');
    expect(phoneNumberField).toHaveValue('1234567890');
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
        screen.getByRole('heading', { name: /Request description/i })
      ).toBeInTheDocument();
    });
  });

  it('renders draft business case fields message', async () => {
    await renderPage(defaultStore);

    expect(
      screen.getByTestId('draft-business-case-fields-alert')
    ).toBeInTheDocument();
  });

  it('navigates to next page', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /next/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('request-description')).toBeInTheDocument();
    });
  });

  describe('Final Business Case', () => {
    it('does not render draft business case fields message', async () => {
      await renderPage(defaultStore, true);

      expect(
        screen.queryByTestId('draft-business-case-fields-alert')
      ).not.toBeInTheDocument();
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
