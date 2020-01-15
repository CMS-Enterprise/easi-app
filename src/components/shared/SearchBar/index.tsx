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
    className: 'use-input easi-search-bar__input',
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

    return inputLength === 0
      ? []
      : results.filter(
          lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue
        );
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
            className="use-input easi-search-bar__input"
            id="basic-search-field-small"
            type="search"
            name={name}
            onChange={onSearch}
          />
        )}
        <button className="usa-button" type="submit">
          <span className="usa-sr-only">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
