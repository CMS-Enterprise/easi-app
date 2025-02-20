import React from 'react';
import { render } from '@testing-library/react';

import AdminTaskStatusTag from '.';

describe('TRB Admin status tag', () => {
  it('Renders correct status text', () => {
    const { getByTestId } = render(
      <AdminTaskStatusTag
        status="READY_FOR_REVIEW"
        name="Jerry Seinfeld"
        date="2023-01-05T07:26:16.036618Z"
      />
    );

    expect(getByTestId('trb-admin-status-tag')).toHaveTextContent(
      'Ready for review'
    );

    expect(getByTestId('status-author-text')).toHaveTextContent(
      'by Jerry Seinfeld on January 5, 2023'
    );
  });
});
