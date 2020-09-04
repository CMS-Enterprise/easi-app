import { DateTime } from 'luxon';

export type ClientFlagsState = {
  taskListLite: boolean;
  isLoading: boolean | null;
  loadedTimestamp: DateTime | null;
  error: string | null;
};
