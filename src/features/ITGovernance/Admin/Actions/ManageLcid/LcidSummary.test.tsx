import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeLCIDStatus,
  SystemIntakeLCIDType
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import { formatDateLocal } from 'utils/date';

import LcidSummary, { LcidSummaryProps } from './LcidSummary';

const currentDate = DateTime.local();

describe('LCID summary box', () => {
  it('Renders LCID information', () => {
    const props: LcidSummaryProps = {
      lcid: '123456',
      lcidDisplay: '123456 - 2026 - OIT - NEW_SYSTEM - SHORTENED',
      lcidIssuedAt: currentDate.minus({ days: 7 }).toISO(),
      lcidExpiresAt: currentDate.plus({ year: 1 }).toISO(),
      lcidRetiresAt: null,
      decisionNextSteps: 'Test next steps',
      lcidScope: 'Test scope',
      lcidCostBaseline: 'Test cost baseline',
      lcidType: SystemIntakeLCIDType.NEW_SYSTEM,
      lcidIsShortened: true,
      lcidIsLowIt: false,
      lcidStatus: SystemIntakeLCIDStatus.ISSUED
    };

    render(<LcidSummary {...props} />);

    expect(screen.getByText(props.lcidDisplay!));

    expect(screen.getByText(props.decisionNextSteps!));
    expect(screen.getByText(props.lcidScope!));
    expect(screen.getByText(props.lcidCostBaseline!));
    expect(screen.getByText('New system'));
    expect(screen.getByText('Is this a shortened LCID?'));
    expect(screen.getByText('Is this LCID low IT?'));
    expect(screen.getByText('Yes'));
    expect(screen.getByText('No'));

    expect(
      screen.getByText(formatDateLocal(props.lcidIssuedAt!, 'MM/dd/yyyy'))
    );

    expect(
      screen.getByText(formatDateLocal(props.lcidExpiresAt!, 'MM/dd/yyyy'))
    );
  });
});
