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
  const inputProps = {
    className: 'usa-input easi-search-bar__input',
    id: 'basic-search-field-small',
    type: 'search',
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

    // Only give suggestions if the user types 2 or more charcters
    if (inputLength >= 2) {
      return results
        .filter(lang => lang.name.toLowerCase().indexOf(inputValue) > -1)
        .slice(0, 10);
    }
    return [];
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(searchValue);
    event.preventDefault();
  };
  return (
    <form
      className="usa-search usa-search--small easi-search-bar"
      onSubmit={handleSubmit}
    >
      <div role="search">
        {results && getSuggestionValue && renderSuggestion ? (
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        ) : (
          <input
            className="usa-input easi-search-bar__input"
            id="basic-search-field-small"
            type="search"
            name={name}
            onChange={onSearch}
          />
        )}
        <button
          className="usa-button"
          type="submit"
          data-testid="search-bar-search-btn"
        >
          <span className="usa-sr-only">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
