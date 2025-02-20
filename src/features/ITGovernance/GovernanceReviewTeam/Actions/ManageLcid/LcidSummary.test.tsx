import React from 'react';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

import LcidSummary, { LcidSummaryProps } from './LcidSummary';

const currentDate = DateTime.local();

describe('LCID summary box', () => {
  it('Renders LCID information', () => {
    const props: LcidSummaryProps = {
      lcid: '123456',
      lcidIssuedAt: currentDate.minus({ days: 7 }).toISO(),
      lcidExpiresAt: currentDate.plus({ year: 1 }).toISO(),
      lcidRetiresAt: null,
      decisionNextSteps: 'Test next steps',
      lcidScope: 'Test scope',
      lcidCostBaseline: 'Test cost baseline',
      lcidStatus: SystemIntakeLCIDStatus.ISSUED
    };

    render(<LcidSummary {...props} />);

    expect(screen.getByText(props.lcid!));

    expect(screen.getByText(props.decisionNextSteps!));
    expect(screen.getByText(props.lcidScope!));
    expect(screen.getByText(props.lcidCostBaseline!));

    expect(
      screen.getByText(formatDateLocal(props.lcidIssuedAt!, 'MM/dd/yyyy'))
    );

    expect(
      screen.getByText(formatDateLocal(props.lcidExpiresAt!, 'MM/dd/yyyy'))
    );
  });
});
