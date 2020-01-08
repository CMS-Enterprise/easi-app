import React from 'react';

type SearchBarProps = {
  name: string;
  onSearch: () => void;
};

const SearchBar = ({ name, onSearch }: SearchBarProps) => {
  return (
    <form className="usa-search usa-search--small">
      <div role="search">
        <input
          className="usa-input"
          id="basic-search-field-small"
          type="search"
          name={name}
          onChange={onSearch}
        />
        <button className="usa-button" type="submit">
          <span className="usa-sr-only">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
