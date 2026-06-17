import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SystemIntakeContactComponent,
  SystemIntakeDecisionState,
  SystemIntakeLCIDType
} from 'gql/generated/graphql';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  getSystemIntakesWithLcidsQuery,
  systemIntake,
  systemIntakeWithLcid
} from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { formatDateLocal } from 'utils/date';
import typeRichText from 'utils/testing/typeRichText';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import { EditsRequestedContext } from '..';

import IssueLcid from './IssueLcid';

/** Checks field default values when lcid is selected */
const checkFieldDefaults = async () => {
  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: 'Expiration date *' })
    ).toHaveValue(
      formatDateLocal(systemIntakeWithLcid.lcidExpiresAt || '', 'MM/dd/yyyy')
    );
  });

  await waitFor(() => {
    expect(screen.getByTestId('scope')).toContainHTML(
      systemIntakeWithLcid.lcidScope!
    );
  });

  await waitFor(() => {
    expect(screen.getByTestId('nextSteps')).toContainHTML(
      systemIntakeWithLcid.decisionNextSteps!
    );
  });

  await waitFor(() => {
    expect(
      screen.getByRole('radio', {
        name: 'No, they may if they wish but it’s not necessary'
      })
    ).toBeChecked();
  });

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: 'Project cost baseline' })
    ).toHaveValue(systemIntakeWithLcid.lcidCostBaseline!);
  });

  await waitFor(() => {
    expect(screen.getByRole('combobox', { name: 'LCID type *' })).toHaveValue(
      systemIntakeWithLcid.lcidType!
    );
  });

  await waitFor(() => {
    expect(
      screen.getByRole('combobox', { name: 'LCID component *' })
    ).toHaveValue(systemIntakeWithLcid.lcidComponent!);
  });

  await waitFor(() => {
    const noOptions = screen.getAllByRole('radio', { name: 'No' });
    expect(noOptions[0]).toBeChecked();
    expect(noOptions[1]).toBeChecked();
  });
};

describe('Issue LCID form', async () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('Populates fields when existing LCID is selected', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery(),
          getSystemIntakeQuery(),
          getSystemIntakesWithLcidsQuery
        ]}
      >
        <MemoryRouter>
          <MessageProvider>
            <IssueLcid {...systemIntake} systemIntakeId={systemIntake.id} />
          </MessageProvider>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await screen.findByText('Issue a Life Cycle ID');

    const useExisting = screen.getByRole('radio', {
      name: 'Use an existing Life Cycle ID'
    });

    await user.click(useExisting);

    const selectLcid = screen.getByRole('combobox', {
      name: 'Life Cycle ID *'
    });

    await user.selectOptions(selectLcid, [systemIntakeWithLcid.lcid!]);
    expect(selectLcid).toHaveValue(systemIntakeWithLcid.lcid);

    checkFieldDefaults();
  });

  it('Displays confirmation modal when edits are requested', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery(),
          getSystemIntakeQuery(),
          getSystemIntakesWithLcidsQuery
        ]}
        addTypename
      >
        <MemoryRouter>
          <MessageProvider>
            <EditsRequestedContext.Provider value="intakeRequest">
              <IssueLcid {...systemIntake} systemIntakeId={systemIntake.id} />
            </EditsRequestedContext.Provider>
          </MessageProvider>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await screen.findByText('Issue a Life Cycle ID');

    await user.click(
      screen.getByRole('radio', {
        name: 'Generate a new Life Cycle ID'
      })
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Expiration date *' }),
      '01/01/2024'
    );

    await typeRichText(screen.getByTestId('scope'), 'Test scope');

    await typeRichText(screen.getByTestId('nextSteps'), 'Test next steps');

    await user.click(
      screen.getByRole('radio', {
        name: 'No, they may if they wish but it’s not necessary'
      })
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'LCID type *' }),
      SystemIntakeLCIDType.NEW_SYSTEM
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'LCID component *' }),
      SystemIntakeContactComponent.OFFICE_OF_INFORMATION_TECHNOLOGY_OIT
    );

    const noOptions = screen.getAllByRole('radio', { name: 'No' });
    await user.click(noOptions[1]);

    const submitButton = screen.getByRole('button', {
      name: 'Complete action'
    });

    await user.click(submitButton);
    expect(
      await screen.findByText('Please make a selection')
    ).toBeInTheDocument();

    await user.click(noOptions[0]);

    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    // Check for modal

    const modalTitle = await screen.findByText(
      'Are you sure you want to complete this decision action?'
    );
    expect(modalTitle).toBeInTheDocument();

    const modalText = screen.getByText(
      'You previously requested that the team make changes to their Intake Request form. Completing this decision action will remove the “Edits requested” status from that form, and the requester will no longer be able to make any changes.'
    );
    expect(modalText).toBeInTheDocument();
  });

  it('renders form for Confirm LCID', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery(),
          getSystemIntakeQuery(),
          getSystemIntakesWithLcidsQuery
        ]}
      >
        <MemoryRouter>
          <MessageProvider>
            <IssueLcid
              {...systemIntake}
              {...systemIntakeWithLcid}
              decisionState={SystemIntakeDecisionState.LCID_ISSUED}
              systemIntakeId={systemIntake.id}
            />
          </MessageProvider>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Current LCID is displayed
    const testId = await screen.findByTestId('current-lcid');
    expect(testId).toHaveTextContent(systemIntakeWithLcid.lcid!);

    // Confirm LCID alert
    expect(
      screen.getByText(
        'After you confirm this decision, you may continue to modify this LCID using any of the “Manage a Life Cycle ID” actions.'
      )
    ).toBeInTheDocument();

    checkFieldDefaults();
  });

  it('renders LCID type and component options', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery(),
          getSystemIntakeQuery(),
          getSystemIntakesWithLcidsQuery
        ]}
      >
        <MemoryRouter>
          <MessageProvider>
            <IssueLcid {...systemIntake} systemIntakeId={systemIntake.id} />
          </MessageProvider>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    await screen.findByText('Issue a Life Cycle ID');

    const lcidTypeSelect = screen.getByRole('combobox', {
      name: 'LCID type *'
    });

    expect(lcidTypeSelect).toHaveTextContent('New system');
    expect(lcidTypeSelect).toHaveTextContent('Recompete');
    expect(lcidTypeSelect).not.toHaveTextContent('Shortened LCID');

    const lcidComponentSelect = screen.getByRole('combobox', {
      name: 'LCID component *'
    });

    expect(lcidComponentSelect).toHaveValue(systemIntake.requester?.component);
    expect(lcidComponentSelect).toHaveTextContent(
      'Office of Information Technology'
    );
    expect(lcidComponentSelect).toHaveTextContent('Center for Medicare');
  });
});
