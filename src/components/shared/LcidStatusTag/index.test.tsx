import React from 'react';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { DateTime } from 'luxon';

import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';

import LcidStatusTag from '.';

const lcidExpiresAt = DateTime.local().plus({ year: 1 }).toISO();

describe('LCID status tag', () => {
  it('Renders ISSUED status', () => {
    render(
      <LcidStatusTag
        lcidStatus={SystemIntakeLCIDStatus.ISSUED}
        lcidExpiresAt={lcidExpiresAt}
        lcidRetiresAt={null}
      />
    );

    expect(screen.getByText(i18next.t<string>('action:lcidStatusTag.ISSUED')));
  });

  it('Renders EXPIRED status', () => {
    render(
      <LcidStatusTag
        lcidStatus={SystemIntakeLCIDStatus.EXPIRED}
        lcidExpiresAt={DateTime.local().minus({ year: 1 }).toISO()}
        lcidRetiresAt={null}
      />
    );

    expect(screen.getByText(i18next.t<string>('action:lcidStatusTag.EXPIRED')));
  });

  it('Renders EXPIRING_SOON status', () => {
    render(
      <LcidStatusTag
        lcidStatus={SystemIntakeLCIDStatus.ISSUED}
        lcidExpiresAt={DateTime.local().plus({ days: 2 }).toISO()}
        lcidRetiresAt={null}
      />
    );

    expect(
      screen.getByText(i18next.t<string>('action:lcidStatusTag.EXPIRING_SOON'))
    );
  });

  it('Renders RETIRED status', () => {
    render(
      <LcidStatusTag
        lcidStatus={SystemIntakeLCIDStatus.RETIRED}
        lcidExpiresAt={lcidExpiresAt}
        lcidRetiresAt={DateTime.local().minus({ year: 1 }).toISO()}
      />
    );

    expect(screen.getByText(i18next.t<string>('action:lcidStatusTag.RETIRED')));
  });

  it('Renders RETIRING_SOON status', () => {
    render(
      <LcidStatusTag
        lcidStatus={SystemIntakeLCIDStatus.ISSUED}
        lcidExpiresAt={lcidExpiresAt}
        lcidRetiresAt={DateTime.local().plus({ days: 2 }).toISO()}
      />
    );

    expect(
      screen.getByText(i18next.t<string>('action:lcidStatusTag.RETIRING_SOON'))
    );
  });
});
