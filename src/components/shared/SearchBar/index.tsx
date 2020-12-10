import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

import './index.scss';

type SearchBarProps = {
  name: string;
  results?: any[];
  onSearch: () => void;
  getSuggestionValue?: (suggestion: any) => string;
  renderSuggestion?: (suggestion: any) => JSX.Element | string;
};

const SearchBar = ({
  name,
  onSearch,
  results = [],
  getSuggestionValue,
  renderSuggestion
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputProps = {
    className: 'usa-input easi-search-bar__autocomplete-input',
    type: 'search',
    'aria-label': 'Search',
    name,
    value: searchValue,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement>,
      { newValue }: any
    ) => {
      setSearchValue(newValue);
    }
  };

  const getSuggestions = (value: string): any => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // Only give suggestions if the user types 2 or more characters
    if (inputLength >= 2) {
      return results
        .filter(lang => lang.name.toLowerCase().indexOf(inputValue) > -1)
        .slice(0, 10);
    }
    return [];
  };

  const renderSuggestionsContainer = ({ containerProps, children }: any) => {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div {...containerProps}>
        {children}
        {searchValue.trim().length >= 2 &&
          suggestions.length <= 0 &&
          isInputFocused && (
            <div className="easi-search-bar__no-results">
              No matching results were found
            </div>
          )}
      </div>
    );
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getSuggestions(value));
    setIsInputFocused(true);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
    setIsInputFocused(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="easi-search-bar" onSubmit={handleSubmit}>
      {results && getSuggestionValue && renderSuggestion ? (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          renderSuggestionsContainer={renderSuggestionsContainer}
        />
      ) : (
        <input
          className="usa-input easi-search-bar__input"
          type="search"
          aria-label="Search"
          name={name}
          onChange={onSearch}
        />
      )}
      <button
        className="usa-button"
        type="submit"
        data-testid="search-bar-search-btn"
      >
        <span className="fa fa-search" />
        <span className="usa-sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
