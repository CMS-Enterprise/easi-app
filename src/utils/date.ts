import { DateTime } from 'luxon';

// Used to parse out mintute, day, ,month, and years from ISOString
export const parseAsDate = (date: string) =>
  DateTime.fromISO(date, { zone: 'utc' });

export const formatDate = (date: string | DateTime, local?: boolean) => {
  // ISO String
  if (typeof date === 'string') {
    return local
      ? DateTime.fromISO(date).toFormat('MMMM d yyyy')
      : parseAsDate(date).toFormat('MMMM d yyyy');
  }

  // luxon DateTime
  if (date instanceof DateTime) {
    // console.log(date);
    return date.toFormat('MMMM d yyyy');
  }

  return '';
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
