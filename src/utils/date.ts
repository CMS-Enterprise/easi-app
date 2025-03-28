import { DateTime, Interval } from 'luxon';

// Used to parse out mintute, day, ,month, and years from ISOString
export const parseAsUTC = (date: string) => DateTime.fromISO(date).toUTC();

type DateFormat = 'MM/dd/yyyy' | 'MMMM d, yyyy' | 'MM/yyyy';

/**
 * Output from format to UTC ISO string
 */
export const formatToUTCISO = (
  date: string | null | undefined,
  format: DateFormat
): string => {
  if (date) {
    const parsedDate = DateTime.fromFormat(date, format).toUTC().toISO();
    if (parsedDate !== 'Invalid DateTime') return parsedDate || '';
  }
  return '';
};

/**
 * Output local timezoned dates from iso string.
 * Typically used for dates generated with time, or server generated dates
 * Dates may differ depending on local time zone
 */
export const formatDateLocal = (
  date: string | null | undefined,
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
  date: string | null | undefined,
  format: DateFormat
): string => {
  if (date) {
    const parsedDate = DateTime.fromISO(date, { zone: 'UTC' }).toFormat(format);
    if (parsedDate !== 'Invalid DateTime') return parsedDate;
  }
  return '';
};

type ContractDate = {
  day?: string | null | undefined;
  month?: string | null | undefined;
  year?: string | null | undefined;
};

export const formatContractDate = (date?: ContractDate): string => {
  if (!date) return '';

  const { month, day, year } = date;

  const parts = [month, day, year];
  return parts
    .filter((value: string | null | undefined) => value && value.length > 0)
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

/**
 * If less than 30 days have passed since `date`, returns "today" or "X days ago".
 *
 * Otherwise, returns formatted date.
 */
export const getRelativeDate = (
  date: string | null,
  /**
   * Number of days between `date` and now to display relative date
   * before switching to formatted date
   */
  relativeDateLimit: number = 30
): string => {
  if (!date) return '';

  const dateTime = DateTime.fromISO(date);

  if (!dateTime.isValid) return '';

  /** Interval between now and `date` */
  const interval = Interval.fromDateTimes(dateTime, DateTime.now());

  // Subtract one from the interval count to see how many days since the initial date
  const days = interval.count('days') - 1;

  // If more than 30 days have passed, return formatted date
  if (days > relativeDateLimit) {
    return DateTime.fromISO(date).toFormat('MM/dd/yyyy');
  }

  // Return relative date
  return dateTime.toRelativeCalendar({ unit: 'days' });
};

// Formats whole days, hours, and minutes between now and a given ISO string
export const formatDaysHoursMinutes = (
  isoString: string | null | undefined
) => {
  if (!isoString) return { days: 0, hours: 0, minutes: 0 };

  // Parse the ISO string into a Luxon DateTime object in UTC
  const dateTime = DateTime.fromISO(isoString, { zone: 'utc' });

  // Get the current time in UTC
  const now = DateTime.utc();

  // Calculate the difference between the two DateTime objects
  const diff = now.diff(dateTime, ['days', 'hours', 'minutes']);

  // Extract whole number of days, hours, and minutes and make them absolute
  const days = Math.abs(Math.floor(diff.as('days')));
  const hours = Math.abs(Math.floor(diff.hours));
  const minutes = Math.abs(Math.floor(diff.minutes));

  return { days, hours, minutes };
};
