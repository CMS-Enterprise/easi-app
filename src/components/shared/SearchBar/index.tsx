import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

type SearchBarProps = {
  name: string;
  results?: any[];
  onSearch: () => void;
  getSuggestionValue?: () => string;
  renderSuggestion?: () => HTMLElement;
};

const SearchBar = ({
  name,
  onSearch,
  results,
  getSuggestionValue,
  renderSuggestion
}: SearchBarProps) => {
  const [searchValue] = useState('');
  const [suggestions] = useState([]);
  const inputProps = {
    className: 'use-input',
    id: 'basic-search-field-small',
    type: 'search',
    name,
    value: searchValue,
    onChange: onSearch
  };

  const onSuggestionsFetchRequested = () => {};

  const onSuggestionsClearRequested = () => {};

  return (
    <form className="usa-search usa-search--small">
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
            className="usa-input"
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
