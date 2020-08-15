import React from 'react';
import { shallow } from 'enzyme';

import PageNumber from './index';

describe('The Page Number component', () => {
  it('renders without crashing', () => {
    shallow(<PageNumber currentPage={0} totalPages={0} />);
  });

  it('renders the correct page numbers', () => {
    const component = shallow(<PageNumber currentPage={2} totalPages={10} />);

    expect(component.find('.easi-page-number__page-num').text()).toEqual(
      'Page 2 of 10'
    );
  });

  it('renders custom className', () => {
    const fixture = 'test-class-name';
    const component = shallow(
      <PageNumber className={fixture} currentPage={2} totalPages={10} />
    );

    expect(component.find(`.${fixture}`).exists()).toEqual(true);
  });
});
