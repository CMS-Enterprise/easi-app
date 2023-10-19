import { useTranslation } from 'react-i18next';

import { systemIntakeForTable } from 'data/mock/systemIntake';
import {
  GetSystemIntakesTable_systemIntakes as TableSystemIntake,
  GetSystemIntakesTable_systemIntakes_notes as AdminNote
} from 'queries/types/GetSystemIntakesTable';
import { SystemIntakeState } from 'types/graphql-global-types';

import tableMap from './tableMap';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: String) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    };
  }
}));

const fundingSources: TableSystemIntake['fundingSources'] = [
  {
    __typename: 'SystemIntakeFundingSource',
    source: 'Research',
    fundingNumber: '123456'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    source: 'HITECH Medicaid',
    fundingNumber: '123456'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    source: 'DARPA',
    fundingNumber: '789012'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    source: 'Recovery Audit Contractors',
    fundingNumber: '789012'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    source: 'Prog Ops',
    fundingNumber: '654321'
  }
];

const note = (count: number): AdminNote => {
  return {
    __typename: 'SystemIntakeNote',
    id: count.toString(),
    createdAt: `2022-10-0${count.toString()}T14:55:47.88283Z`,
    content: 'This is an admin note'
  };
};

const intakes: Array<TableSystemIntake> = [
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
  const { t } = useTranslation();
  it('references correct admin note or action for filter date', () => {
    const formattedIntakes = tableMap(intakes, t);

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

  it('formats funding sources into string', () => {
    const intakeWithFundingSources = {
      ...systemIntakeForTable,
      fundingSources
    };

    const [intake] = tableMap([intakeWithFundingSources], t);

    expect(intake.fundingSources).toEqual(
      '123456 (Research, HITECH Medicaid), 654321 (Prog Ops), 789012 (DARPA, Recovery Audit Contractors)'
    );
  });
});
