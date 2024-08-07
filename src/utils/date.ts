import { DateTime } from 'luxon';

// Used to parse out mintute, day, ,month, and years from ISOString
export const parseAsUTC = (date: string) => DateTime.fromISO(date).toUTC();

type DateFormat = 'MM/dd/yyyy' | 'MMMM d, yyyy' | 'MM/yyyy';

/**
 * Output local timezoned dates from iso string.
 * Typically used for dates generated with time, or server generated dates
 * Dates may differ depending on local time zone
 */
export const formatDateLocal = (
  date: string | null,
  format: DateFormat
): string => {
  if (date) {
    const parsedDate = DateTime.fromISO(date).toFormat(format);
    if (parsedDate !== 'Invalid DateTime') return parsedDate;
  }
  return '';
};

/**
 * Output UTC timezoned dates from iso string.
 * Typically used for dates from user input, where utc timezone needs to be set
 * explicitly in order to match timezoneless dates within a iso string correctly.
 */
export const formatDateUtc = (
  date: string | null,
  format: DateFormat
): string => {
  if (date) {
    const parsedDate = DateTime.fromISO(date, { zone: 'UTC' }).toFormat(format);
    if (parsedDate !== 'Invalid DateTime') return parsedDate;
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

export const isDateInPast = (date: string | null): boolean => {
  if (date && new Date() > new Date(date)) {
    return true;
  }
  return false;
};
