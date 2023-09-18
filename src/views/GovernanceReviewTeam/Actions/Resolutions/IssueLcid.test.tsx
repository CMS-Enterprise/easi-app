import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  getSystemIntakesWithLcidsQuery,
  systemIntake,
  systemIntakeWithLcid
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import {
  SystemIntakeDecisionState,
  SystemIntakeState
} from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import IssueLcid from './IssueLcid';

describe('Issue LCID form', async () => {
  it('Populates fields when existing LCID is selected', async () => {
    render(
      <VerboseMockedProvider
        mocks={[
          getSystemIntakeContactsQuery,
          getSystemIntakeQuery,
          getSystemIntakesWithLcidsQuery
        ]}
      >
        <MemoryRouter>
          <MessageProvider>
            <IssueLcid
              systemIntakeId={systemIntake.id}
              state={SystemIntakeState.OPEN}
              decisionState={SystemIntakeDecisionState.NO_DECISION}
            />
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

    expect(
      screen.getByRole('textbox', { name: 'Scope of Life Cycle ID *' })
    ).toHaveValue(systemIntakeWithLcid.lcidScope);

    expect(screen.getByRole('textbox', { name: 'Next Steps *' })).toHaveValue(
      systemIntakeWithLcid.decisionNextSteps
    );

    expect(
      screen.getByRole('radio', {
        name: 'No, they may if they wish but it’s not necessary'
      })
    ).toBeChecked();

    expect(
      screen.getByRole('textbox', { name: 'Project cost baseline' })
    ).toHaveValue(systemIntakeWithLcid.lcidCostBaseline);
  });
});
