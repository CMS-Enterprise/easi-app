import React from 'react';
import { render } from '@testing-library/react';

import RequiredFieldsText from '.';

describe('Required fields text component', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<RequiredFieldsText />);

    expect(asFragment()).toMatchSnapshot();
  });
});
