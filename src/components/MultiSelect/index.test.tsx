import React from 'react';
import selectEvent from 'react-select-event';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MultiSelect from './index';

const options = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' }
];

describe('MultiSelect', () => {
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

  it('updates input values when changing options and their associated tags', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByTestId, queryByTestId } = render(
      <form data-testid="form">
        <label htmlFor="colors">Colors</label>
        <MultiSelect
          name="colors"
          inputId="colors"
          onChange={() => null}
          options={options}
        />
      </form>
    );

    const label = getByLabelText('Colors');

    // Toggle on Red
    await selectEvent.select(label, ['Red']);
    expect(getByTestId('form')).toHaveFormValues({ colors: 'red' });
    expect(getByTestId('multiselect-tag--Red')).toBeInTheDocument();
    expect(queryByTestId('multiselect-tag--Green')).not.toBeInTheDocument();
    expect(queryByTestId('multiselect-tag--Blue')).not.toBeInTheDocument();

    // Add Green
    await selectEvent.select(label, ['Green']);
    expect(getByTestId('form')).toHaveFormValues({ colors: ['red', 'green'] });
    expect(getByTestId('multiselect-tag--Green')).toBeInTheDocument();

    // Remove red via tag
    await user.click(getByLabelText('Remove Red'));
    expect(getByTestId('form')).toHaveFormValues({ colors: 'green' });
    expect(getByTestId('multiselect-tag--Green')).toBeInTheDocument();
    expect(queryByTestId('multiselect-tag--Red')).not.toBeInTheDocument();

    // Remove remaining via input
    await selectEvent.clearFirst(label);
    expect(getByTestId('form')).toHaveFormValues({ colors: '' });
    expect(queryByTestId('multiselect-tag--Red')).not.toBeInTheDocument();
    expect(queryByTestId('multiselect-tag--Green')).not.toBeInTheDocument();
    expect(queryByTestId('multiselect-tag--Blue')).not.toBeInTheDocument();
  });
});
