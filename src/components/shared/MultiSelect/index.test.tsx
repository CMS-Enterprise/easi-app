import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';

import MultiSelect from './index';

describe('RelatedArticle', () => {});

const options = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' }
];

describe('The MultiSelect component', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MultiSelect
        options={options}
        initialValues={[{ label: 'Red', value: 'red' }]}
        onChange={() => null}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders tag for initial selected values', () => {
    const component = shallow(
      <MultiSelect
        options={options}
        initialValues={[{ label: 'Red', value: 'red' }]}
        onChange={() => null}
      />
    );

    expect(component.find('#easi-multiselect__tag-red').exists()).toEqual(true);
  });
});
