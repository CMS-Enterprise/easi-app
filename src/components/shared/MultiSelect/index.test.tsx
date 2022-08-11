import React from 'react';
import { render, screen } from '@testing-library/react';

import MultiSelect from './index';

const options = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' }
];

describe('RelatedArticle', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MultiSelect
        id="test-multiSelect"
        name="testMultiSelect"
        onChange={() => null}
        options={options}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('correctly renders initial values', () => {
    render(
      <MultiSelect
        id="test-multiSelect"
        name="testMultiSelect"
        onChange={() => null}
        options={options}
        initialValues={['red', 'blue']}
      />
    );
    expect(screen.getByTestId('multiselect-tag--Red')).toBeInTheDocument();
    expect(screen.getByTestId('multiselect-tag--Blue')).toBeInTheDocument();
  });
});
