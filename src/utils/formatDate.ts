import { DateTime } from 'luxon';

const formatDate = (date: string) =>
  DateTime.fromISO(date).toFormat('MMMM d yyyy');

export default formatDate;
