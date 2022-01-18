import React from 'react';
import { FilterValue, Row, useAsyncDebounce } from 'react-table';
import { Button, Form, Label, TextInput } from '@trussworks/react-uswds';

import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';

// Truss has a SearchBar component, but it only takes onSubmit - meant for server side filtering.
// This is component is meant for client side filtering using onChange

type GlobalClientFilterProps = {
  setGlobalFilter: (filterValue: FilterValue) => void;
  rows: Row<CedarSystem>[];
  state: FilterValue;
  tableID: string;
  tableName: string;
};

// Component for Global Filter for Client Side filtering
const GlobalClientFilter = ({
  setGlobalFilter,
  rows,
  state,
  tableID,
  tableName
}: GlobalClientFilterProps) => {
  // Set a debounce to capture set input before re-rendering on each character
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Form
      role="search"
      className="usa-search"
      onSubmit={e => {
        e.preventDefault();
        // TODO: CEDAR API filtering may go here if implemented
      }}
    >
      <Label srOnly hidden htmlFor={`${tableID}-search`}>
        Table Search
      </Label>
      <TextInput
        id={`${tableID}-search`}
        type="search"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          // Currently only client-side filtering - updates search filter onChange
          onChange(e.target.value);
        }}
        name={`${tableName} Search`}
      />
      <Button type="submit">
        <span className="usa-search__submit-text">Search</span>
      </Button>
      {state.globalFilter && (
        <p>
          {rows.length === 0
            ? 'No results found.'
            : `Showing ${rows.length} results`}
        </p>
      )}
    </Form>
  );
};

export default GlobalClientFilter;
