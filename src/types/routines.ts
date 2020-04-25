import { createRoutine } from 'redux-saga-routines';

// eslint-disable-next-line import/prefer-default-export
export const fetchSystemIntakes = createRoutine<number>('FETCH_SYSTEM_INTAKES');
