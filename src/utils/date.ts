import { DateTime } from 'luxon';

// Used to parse out mintute, day, ,month, and years from ISOString
export const parseAsUTC = (date: string) => DateTime.fromISO(date).toUTC();

type DateParserType = {
  date: string;
  serverGenerated: boolean;
  format?: 'MM/dd/yyyy' | 'MMMM d, yyyy';
};

/*
 Currently only alternative in use to MMMM d yyyy is MM/dd/yyyy
 User input date need to be parsed in UTC to preserve date
 If iso string contains specific time (server generated dates - ex. dateSubmitted), parse locally
*/
export const formatDate = ({
  date,
  serverGenerated,
  format = 'MMMM d, yyyy'
}: DateParserType) => {
  return serverGenerated
    ? DateTime.fromISO(date).toFormat(format)
    : DateTime.fromISO(date).toUTC().toFormat(format);
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
