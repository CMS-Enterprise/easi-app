// import React, { useState } from 'react';
// import { useAsyncDebounce } from 'react-table';
// import { Search, TextInput } from '@trussworks/react-uswds';
// import { Field } from 'formik';

// interface filterGlobalProps {
//   preGlobalFilteredRows: any;
//   globalFilter: () => void;
//   setGlobalFilter: (columnId: string, filterValue: any) => void;
// }

// interface filterColumnsProps {
//   filterValue: any;
//   preFilteredRows: { length: number };
//   setFilter: (columnId: string, filterValue: any) => void;
// }

// // Component for Global Filter
// export const GlobalFilter = ({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter
// }: filterGlobalProps) => {
//   const [value, setValue] = useState(globalFilter);

//   const onChange = useAsyncDebounce(inputValue => {
//     setGlobalFilter(inputValue || undefined, '');
//   }, 200);

//   return (
//     <div>
//       <Field
//         as={TextInput}
//         id="table"
//         name="value"
//         label="Development"
//         maxLength={10}
//         match={/^[0-9\b]+$/}
//         aria-describedby="DevelopmentCostsDefinition"
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//           setValue(e.target.value);
//           onChange(e.target.value);
//         }}
//       />
//     </div>
//   );
// };

// // Component for Default Column Filter
// export const DefaultFilterForColumn = ({
//   filterValue,
//   preFilteredRows: { length },
//   setFilter
// }): filterColumnsProps => {
//   return (
//     <Search
//       value={filterValue || ''}
//       onChange={e => {
//         // Set undefined to remove the filter entirely
//         setFilter(e.target.value || undefined);
//       }}
//       placeholder={`Search ${length} records..`}
//       style={{ marginTop: '10px' }}
//     />
//   );
// };
