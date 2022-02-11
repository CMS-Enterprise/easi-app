// Global filter for React-Table
// Converts DateTime and numbers to string for proper filtering
// Leave DateTime in tact for proper column sorting

import { IdType, Row } from 'react-table';
import { DateTime } from 'luxon';

import { formatDate } from 'utils/date';

const globalTableFilter = (
  rows: Row[],
  ids: IdType<string>[],
  query: string
) => {
  return rows.filter(row => {
    let foundValue = false;
    Object.keys(row.values).forEach((key: any) => {
      const data = row.values[key];
      const lowerCaseQuery = query.toLowerCase();

      // Null checks for columns with data potentially empty (LCID Expiration, Admin Notes, etc.)
      if (!data) {
        return;
      }

      // If string, convert to lowercase and search
      if (
        typeof data === 'string' &&
        data.toLowerCase().includes(lowerCaseQuery)
      ) {
        foundValue = true;
      }

      // If number, convert to string and search
      if (
        typeof data === 'number' &&
        data.toString().includes(lowerCaseQuery)
      ) {
        foundValue = true;
      }

      // If type of DateTime - convert to string, convert to lowercase, and search
      if (data instanceof DateTime) {
        const stringDate = formatDate(data);
        if (stringDate.toLowerCase().includes(lowerCaseQuery)) {
          foundValue = true;
        }
      }
    });
    return foundValue;
  });
};

export default globalTableFilter;
