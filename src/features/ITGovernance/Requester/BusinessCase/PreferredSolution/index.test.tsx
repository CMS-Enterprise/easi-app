import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessCase from 'features/ITGovernance/Requester/BusinessCase';
import configureMockStore from 'redux-mock-store';
import {
  getGovernanceTaskListQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { businessCaseInitialData } from 'data/businessCase';
import { SystemIntakeStep } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

const renderPage = async (store: any, isFinal?: boolean) => {
  render(
    <MemoryRouter
      initialEntries={[
        '/business/75746af8-9a9b-4558-a375-cf9848eb2b0d/preferred-solution'
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

describe('Business case preferred solution form', () => {
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

    expect(screen.getByTestId('preferred-solution')).toBeInTheDocument();
  });

  it('fill deepest question branch', async () => {
    await renderPage(defaultStore);

    const titleField = screen.getByRole('textbox', {
      name: /title/i
    });
    userEvent.type(titleField, 'Preferred solution title');
    await waitFor(() => {
      expect(titleField).toHaveValue('Preferred solution title');
    });

    const summaryField = screen.getByRole('textbox', {
      name: /summary/i
    });
    userEvent.type(summaryField, 'Preferred solution summary');
    await waitFor(() => {
      expect(summaryField).toHaveValue('Preferred solution summary');
    });

    const acquisitionApproachField = screen.getByRole('textbox', {
      name: /acquisition approach/i
    });
    userEvent.type(
      acquisitionApproachField,
      'Preferred solution acquisition approach'
    );
    await waitFor(() => {
      expect(acquisitionApproachField).toHaveValue(
        'Preferred solution acquisition approach'
      );
    });

    const securityFieldGroup = screen.getByTestId('security-approval');
    const securityNoRadio = within(securityFieldGroup).getByRole('radio', {
      name: /no/i
    });
    securityNoRadio.click();
    await waitFor(() => {
      expect(securityNoRadio).toBeChecked();
    });

    const securityApprovalProgressGroup = screen.getByTestId(
      'security-approval-in-progress'
    );
    const securityApprovalProgressYesRadio = within(
      securityApprovalProgressGroup
    ).getByRole('radio', {
      name: /yes/i
    });
    securityApprovalProgressYesRadio.click();
    await waitFor(() => {
      expect(securityApprovalProgressYesRadio).toBeChecked();
    });

    const cloudHostingRadio = screen.getByRole('radio', { name: /cloud/i });
    cloudHostingRadio.click();
    await waitFor(() => {
      expect(cloudHostingRadio).toBeChecked();
    });

    const hostingLocationField = screen.getByRole('textbox', {
      name: /where are you planning to host/i
    });
    userEvent.type(hostingLocationField, 'Preferred solution hosting location');
    await waitFor(() => {
      expect(hostingLocationField).toHaveValue(
        'Preferred solution hosting location'
      );
    });

    const cloudServiceTypeField = screen.getByRole('textbox', {
      name: /cloud service/i
    });
    userEvent.type(
      cloudServiceTypeField,
      'Preferred solution hosting cloud service'
    );
    await waitFor(() => {
      expect(cloudServiceTypeField).toHaveValue(
        'Preferred solution hosting cloud service'
      );
    });

    const userInterfaceGroup = screen.getByTestId('user-interface-group');
    const userInterfaceYesRadio = within(userInterfaceGroup).getByRole(
      'radio',
      {
        name: /yes/i
      }
    );
    userInterfaceYesRadio.click();
    await waitFor(() => {
      expect(userInterfaceYesRadio).toBeChecked();
    });

    const prosField = screen.getByRole('textbox', {
      name: /pros/i
    });
    userEvent.type(prosField, 'Preferred solution pros');
    await waitFor(() => {
      expect(prosField).toHaveValue('Preferred solution pros');
    });

    const consField = screen.getByRole('textbox', {
      name: /cons/i
    });
    userEvent.type(consField, 'Preferred solution cons');
    await waitFor(() => {
      expect(consField).toHaveValue('Preferred solution cons');
    });

    // Skip Estimated Lifecycle Costs

    const costSavingsField = screen.getByRole('textbox', {
      name: /cost savings/i
    });
    userEvent.type(costSavingsField, 'Preferred solution cost savings');
    await waitFor(() => {
      expect(costSavingsField).toHaveValue('Preferred solution cost savings');
    });
  }, 10000);

  it('is approved by cms security', async () => {
    await renderPage(defaultStore);

    const securityApprovalGroup = screen.getByTestId('security-approval');
    const approvedRadio = within(securityApprovalGroup).getByRole('radio', {
      name: /yes/i
    });
    approvedRadio.click();
    await waitFor(() => {
      expect(approvedRadio).toBeChecked();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('security-approval-in-progress')
      ).not.toBeInTheDocument();
    });
  }, 10000);

  it('fills out data center branch', async () => {
    await renderPage(defaultStore);

    const dataCenterHostingRadio = screen.getByRole('radio', {
      name: /data center/i
    });
    dataCenterHostingRadio.click();
    await waitFor(() => {
      expect(dataCenterHostingRadio).toBeChecked();
    });

    const dataCenterLocationField = screen.getByRole('textbox', {
      name: /which data center/i
    });
    userEvent.type(
      dataCenterLocationField,
      'Preferred solution data center location'
    );
    await waitFor(() => {
      expect(dataCenterLocationField).toHaveValue(
        'Preferred solution data center location'
      );
    });
  });

  it('fills out no hosting branch', async () => {
    await renderPage(defaultStore);

    const dataCenterHostingRadio = screen.getByRole('radio', {
      name: /hosting is not needed/i
    });
    dataCenterHostingRadio.click();
    await waitFor(() => {
      expect(dataCenterHostingRadio).toBeChecked();
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
      expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
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
      expect(screen.getByTestId('request-description')).toBeInTheDocument();
    });
  });

  it('navigates to next page', async () => {
    await renderPage(defaultStore);

    screen.getByRole('button', { name: /next/i }).click();

    await waitFor(() => {
      expect(screen.getByTestId('alternative-solution-a')).toBeInTheDocument();
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
