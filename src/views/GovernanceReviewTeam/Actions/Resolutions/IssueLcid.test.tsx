import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  getSystemIntakesWithLcidsQuery,
  systemIntake,
  systemIntakeWithLcid
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import { SystemIntakeDecisionState } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import typeRichText from 'utils/testing/typeRichText';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import { EditsRequestedContext } from '..';

import IssueLcid from './IssueLcid';

/** Checks field default values when lcid is selected */
const checkFieldDefaults = () => {
  expect(
    screen.getByRole('textbox', { name: 'Expiration date *' })
  ).toHaveValue(
    formatDateLocal(systemIntakeWithLcid.lcidExpiresAt || '', 'MM/dd/yyyy')
  );

  expect(screen.getByTestId('scope')).toContainHTML(
    systemIntakeWithLcid.lcidScope!
  );

  expect(screen.getByTestId('nextSteps')).toContainHTML(
    systemIntakeWithLcid.decisionNextSteps!
  );

  expect(
    screen.getByRole('radio', {
      name: 'No, they may if they wish but it’s not necessary'
    })
  ).toBeChecked();

  expect(
    screen.getByRole('textbox', { name: 'Project cost baseline' })
  ).toHaveValue(systemIntakeWithLcid.lcidCostBaseline!);
};

describe('Issue LCID form', async () => {
  it('Populates fields when existing LCID is selected', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery,
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

    userEvent.click(useExisting);

    const selectLcid = screen.getByRole('combobox', {
      name: 'Life Cycle ID *'
    });

    userEvent.selectOptions(selectLcid, [systemIntakeWithLcid.lcid!]);
    expect(selectLcid).toHaveValue(systemIntakeWithLcid.lcid);

    checkFieldDefaults();
  });

  it('Displays confirmation modal when edits are requested', async () => {
    await act(async () => {
      render(
        <VerboseMockedProvider
          mocks={[
            getSystemIntakeContactsQuery,
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

      userEvent.click(
        screen.getByRole('radio', {
          name: 'Generate a new Life Cycle ID'
        })
      );

      userEvent.type(
        screen.getByRole('textbox', { name: 'Expiration date *' }),
        '01/01/2024'
      );

      await typeRichText(screen.getByTestId('scope'), 'Test scope');

      await typeRichText(screen.getByTestId('nextSteps'), 'Test next steps');

      userEvent.click(
        screen.getByRole('radio', {
          name: 'No, they may if they wish but it’s not necessary'
        })
      );
    });

    const submitButton = screen.getByRole('button', {
      name: 'Complete action'
    });

    expect(submitButton).not.toBeDisabled();

    userEvent.click(submitButton);

    // Check for modal

    const modalTitle = await screen.findByText(
      'Are you sure you want to complete this decision action?'
    );
    expect(modalTitle).toBeInTheDocument();

    const modalText = screen.getByText(
      'You previously requested that the team make changes to their intake request form. Completing this decision action will remove the “Edits requested” status from that form, and the requester will no longer be able to make any changes.'
    );
    expect(modalText).toBeInTheDocument();
  });

  it('renders form for Confirm LCID', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery,
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
});
