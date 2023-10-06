import i18next from 'i18next';

import { systemIntakeForTable } from 'data/mock/systemIntake';
import { GetSystemIntakesTable_systemIntakes_notes as AdminNote } from 'queries/types/GetSystemIntakesTable';
import { SystemIntakeState } from 'types/graphql-global-types';

import tableMap from './tableMap';

const note = (count: number): AdminNote => {
  return {
    __typename: 'SystemIntakeNote',
    id: count.toString(),
    createdAt: `2022-10-0${count.toString()}T14:55:47.88283Z`,
    content: 'This is an admin note'
  };
};

const intakes: Array<typeof systemIntakeForTable> = [
  {
    ...systemIntakeForTable,
    state: SystemIntakeState.CLOSED,
    id: '1',
    notes: [
      note(1),
      { ...note(3), content: 'Last admin note content' },
      note(2)
    ]
  },
  {
    ...systemIntakeForTable,
    state: SystemIntakeState.CLOSED,
    id: '2',
    notes: [note(4), note(5), note(6)]
  },
  {
    ...systemIntakeForTable,
    state: SystemIntakeState.CLOSED,
    id: '3',
    actions: [
      {
        __typename: 'SystemIntakeAction',
        id: '1',
        createdAt: '2022-10-01T14:55:47.88283Z'
      },
      {
        __typename: 'SystemIntakeAction',
        id: '8',
        createdAt: '2022-10-08T14:55:47.88283Z'
      },
      {
        __typename: 'SystemIntakeAction',
        id: '2',
        createdAt: '2022-10-02T14:55:47.88283Z'
      }
    ]
  }
];

describe('System intake request table map', () => {
  it('converts intake to table format', () => {
    const formattedIntakes = tableMap(intakes, i18next.t);

    const intake = formattedIntakes[0];

    const { lastAdminNote } = intake;

    // lastAdminNote prop returns correct note
    expect(lastAdminNote?.content).toEqual('Last admin note content');
    // filterDate prop is set to lastAdminNote createdAt prop
    expect(intake.filterDate).toEqual(lastAdminNote?.createdAt);

    // If intake has no admin notes,
    // filterDate is set to last admin action createdAt date
    const intakeWithNoNotes = formattedIntakes[2];
    const lastAdminAction = intakeWithNoNotes.actions[1];
    expect(intakeWithNoNotes.filterDate).toEqual(lastAdminAction.createdAt);
  });
});
