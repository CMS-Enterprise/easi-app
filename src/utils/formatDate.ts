import { DateTime } from 'luxon';

const formatDate = (date: string | DateTime) => {
  // ISO String
  if (typeof date === 'string') {
    return DateTime.fromISO(date).toFormat('MMMM d yyyy');
  }

  // luxon DateTime
  if (date instanceof DateTime) {
    return date.toFormat('MMMM d yyyy');
  }

  return '';
};

type ContractDate = {
  day: string;
  month: string;
  year: string;
};

export const formatContractDate = (date: ContractDate): string => {
  const parts = [date.month, date.day, date.year];
  return parts.filter((value: string) => value.length > 0).join('/');
};

export default formatDate;
