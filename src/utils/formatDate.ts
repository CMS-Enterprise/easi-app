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

export default formatDate;
