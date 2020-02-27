import React from 'react';
import { shallow, mount } from 'enzyme';
import BackNextButtons from './index';

describe('The Back/Next Button component', () => {
  it('renders without crashing', () => {
    shallow(
      <BackNextButtons
        pageNum={1}
        totalPages={1}
        setPage={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
  });

  describe('total pages greater than current page number', () => {
    const onClickMock = jest.fn();
    const component = mount(
      <BackNextButtons
        pageNum={1}
        totalPages={5}
        setPage={onClickMock}
        onSubmit={jest.fn()}
      />
    );
    it('renders a next button', () => {
      expect(component.find('button').length).toEqual(1);
      expect(component.find('button').text()).toEqual('Next');
    });

    it('triggers setPack when Next is clicked', () => {
      component.find('button').simulate('click');
      expect(onClickMock).toHaveBeenCalled();
    });
  });

  describe('total pages less than current page number AND is greater than 1', () => {
    const onClickMock = jest.fn();
    const component = mount(
      <BackNextButtons
        pageNum={3}
        totalPages={5}
        setPage={onClickMock}
        onSubmit={jest.fn()}
      />
    );

    it('renders a next button', () => {
      expect(component.find('button').length).toEqual(2);
      expect(
        component
          .find('button')
          .first()
          .text()
      ).toEqual('Back');
      expect(
        component
          .find('button')
          .last()
          .text()
      ).toEqual('Next');
    });

    it('triggers setPack when Next is clicked', () => {
      component
        .find('button')
        .first()
        .simulate('click');
      expect(onClickMock).toHaveBeenCalled();
    });
  });

  describe('total pages is equal to current page number', () => {
    it('renders a next button', () => {
      const component = shallow(
        <BackNextButtons
          pageNum={5}
          totalPages={5}
          setPage={jest.fn()}
          onSubmit={jest.fn()}
        />
      );

      expect(component.find('button').length).toEqual(2);
      expect(
        component
          .find('button')
          .first()
          .text()
      ).toEqual('Back');
      expect(
        component
          .find('button')
          .last()
          .text()
      ).toEqual('Review & Send');
    });
  });
});
