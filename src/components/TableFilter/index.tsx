import React from 'react';
import { FilterValue, useAsyncDebounce } from 'react-table';
import { Button, Form, Label, TextInput } from '@trussworks/react-uswds';
import classnames from 'classnames';

// Truss has a SearchBar component, but it only takes onSubmit - meant for server side filtering.
// This is component is meant for client side filtering using onChange

type GlobalClientFilterProps = {
  setGlobalFilter: (filterValue: FilterValue) => void;
  tableID: string;
  tableName: string;
  className?: string;
};

// Component for Global Filter for Client Side filtering
const GlobalClientFilter = ({
  setGlobalFilter,
  tableID,
  tableName,
  className
}: GlobalClientFilterProps) => {
  // Set a debounce to capture set input before re-rendering on each character
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Form
      role="search"
      className={classnames('usa-search', className)}
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
      <Button type="submit" style={{ pointerEvents: 'none' }}>
        {' '}
        {/* Right not search button doesn't need to do anything, it searches onChange */}
        <span className="usa-search__submit-text fa fa-search" />
      </Button>
    </Form>
  );
};

export default GlobalClientFilter;
