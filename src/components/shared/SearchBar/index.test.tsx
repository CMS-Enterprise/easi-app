import React from 'react';
import Autosuggest from 'react-autosuggest';
import { mount, shallow } from 'enzyme';

import SearchBar from './index';

describe('The Search Bar component', () => {
  it('renders without crashing', () => {
    shallow(<SearchBar name="test-name" onSearch={() => {}} />);
  });

  it('accepts a name attribute', () => {
    const fixture = 'test-name-attr';
    const component = shallow(<SearchBar name={fixture} onSearch={() => {}} />);
    expect(component.find(`input[name="${fixture}"]`).length).toEqual(1);
  });

  it('prevents the default action of submitting a form', () => {
    const spy = jest.fn();
    const component = mount(
      <SearchBar name="test-name-attr" onSearch={() => {}} />
    );
    const searchBtn = component.find('[data-testid="search-bar-search-btn"]');
    component.find('.usa-input').simulate('change', { target: { value: '' } });
    searchBtn.simulate('submit', {
      preventDefault: () => {
        spy();
      }
    });
    expect(spy).toHaveBeenCalled();
  });

  describe('The default Search Bar w/o autocomplete', () => {
    it('triggers on onChange action', () => {
      const fixture = jest.fn();
      const event = {
        target: {
          value: 'EASi'
        }
      };

      const component = mount(
        <SearchBar name="test-name-attr" onSearch={fixture} />
      );
      component.find('.usa-input').simulate('change', event);
      expect(fixture).toHaveBeenCalled();
    });
  });

  describe('The Search Bar with autocomplete', () => {
    const onSearch = jest.fn();
    const getSuggestionValue = (obj: any): string => obj.name;
    const renderSuggestion = (obj: any): string => obj.name;

    it('renders react-autocomplete', () => {
      const component = shallow(
        <SearchBar
          name="test-name-attr"
          onSearch={onSearch}
          results={[]}
          getSuggestionValue={jest.fn()}
          renderSuggestion={jest.fn()}
        />
      );
      expect(component.find(Autosuggest).exists()).toBe(true);
    });

    it('displays suggestions after the second character is entered', () => {
      const results = [
        { name: 'Apple' },
        { name: 'Orange' },
        { name: 'Pear' },
        { name: 'Peach' }
      ];

      const wrapper = mount(
        <SearchBar
          name="test-name-attr"
          onSearch={onSearch}
          results={results}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
        />
      );

      const inputField = wrapper.find(
        'input.easi-search-bar__autocomplete-input'
      );

      inputField.simulate('change', { target: { value: 'o' } });
      inputField.simulate('focus');
      expect(wrapper.find('li.react-autosuggest__suggestion').length).toEqual(
        0
      );

      inputField.simulate('change', { target: { value: 'or' } });
      inputField.simulate('focus');
      expect(wrapper.find('li.react-autosuggest__suggestion').length).toEqual(
        1
      );
    });

    it('displays suggestions that match the input value', () => {
      const event = {
        target: {
          value: 'or'
        }
      };

      const results = [
        { name: 'Apple' },
        { name: 'Orange' },
        { name: 'Pear' },
        { name: 'Peach' }
      ];

      const wrapper = mount(
        <SearchBar
          name="test-name-attr"
          onSearch={onSearch}
          results={results}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
        />
      );

      const inputField = wrapper.find(
        'input.easi-search-bar__autocomplete-input'
      );
      inputField.simulate('change', event);
      inputField.simulate('focus');
      expect(wrapper.find('li.react-autosuggest__suggestion').length).toEqual(
        1
      );
    });

    it('clears out suggestions when a suggestion is selected', () => {
      const event = {
        target: {
          value: 'ea'
        }
      };

      const results = [
        { name: 'ApPlE' },
        { name: 'oRaNgE' },
        { name: 'PeAr' },
        { name: 'pEaCh' }
      ];

      const wrapper = mount(
        <SearchBar
          name="test-name-attr"
          onSearch={onSearch}
          results={results}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
        />
      );

      const inputField = wrapper.find(
        'input.easi-search-bar__autocomplete-input'
      );
      inputField.simulate('change', event);
      inputField.simulate('focus');
      wrapper
        .find('li.react-autosuggest__suggestion')
        .first()
        .simulate('click');

      // TODO: Figure how to avoid this instance() Typescript error
      const inputFieldInstance = inputField.instance() as any;
      expect(inputFieldInstance.value).toEqual('PeAr');
      expect(wrapper.find('li.react-autosuggest__suggestion').length).toEqual(
        0
      );
    });

    it('displays no matching reseults when there are no suggestions', () => {
      const results = [{ name: 'Josh' }, { name: 'John' }];
      const wrapper = mount(
        <SearchBar
          name="test-name-attr"
          onSearch={onSearch}
          results={results}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
        />
      );

      const event = {
        target: {
          value: 'joz'
        }
      };

      const inputField = wrapper.find(
        'input.easi-search-bar__autocomplete-input'
      );
      expect(wrapper.find('.easi-search-bar__no-results').length).toEqual(0);
      inputField.simulate('change', event);
      inputField.simulate('focus');

      expect(wrapper.find('.easi-search-bar__no-results').length).toEqual(1);
    });
  });
});
