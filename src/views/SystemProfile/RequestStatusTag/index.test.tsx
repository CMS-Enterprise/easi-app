import React from 'react';
import { render } from '@testing-library/react';

import RequestStatusTag, { RequestStatus, requestStatusTagClassName } from '.';

describe('RequestStatusTag', () => {
  test.each(
    Object.entries(requestStatusTagClassName).map(([status, className]) => ({
      status,
      className
    }))
  )('renders request status tag %j', ({ status, className }) => {
    const { asFragment, getByText, container } = render(
      <RequestStatusTag status={status as RequestStatus} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText(status)).toBeVisible();
    expect(container.getElementsByClassName(className).length).toBe(1);
  });
});
