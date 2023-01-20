import { DateTime } from 'luxon';

// Used to parse out mintute, day, ,month, and years from ISOString
export const parseAsUTC = (date: string) => DateTime.fromISO(date).toUTC();

// Currently only alternative in use to MMMM d yyyy is MM/dd/yyyy
// Leaving opening possiblity of 'format' paramter to expand beyond short
export const formatDate = (date: string, format?: 'DATE_SHORT') => {
  const dateFormat = format === 'DATE_SHORT' ? 'MM/dd/yyyy' : 'MMMM d, yyyy';

  // TODO:  remove once frontend sends time with dates
  const isServerGeneratedDate = date.substring(10) === 'T00:00:00Z';

  return isServerGeneratedDate
    ? parseAsUTC(date).toFormat(dateFormat)
    : DateTime.fromISO(date).toFormat(dateFormat);
};

type ContractDate = {
  day: string | null;
  month: string | null;
  year: string | null;
};

export const formatContractDate = (date: ContractDate): string => {
  const { month, day, year } = date;

  const parts = [month, day, year];
  return parts
    .filter((value: string | null) => value && value.length > 0)
    .join('/');
};

/**
 * Returns the input parameter's fiscal year
 * FY 2021 : October 1 2020 - September 30 2021
 * FY 2022 : October 1 2021 - September 30 2022
 * @param date DateTime date object
 */
export const getFiscalYear = (date: DateTime): number => {
  const { month, year } = date;
  if (month >= 10) {
    return year + 1;
  }
  return year;
};
