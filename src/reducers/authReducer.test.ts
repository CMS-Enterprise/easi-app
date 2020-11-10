import { DateTime } from 'luxon';

import authReducer, {
  setUserGroups,
  updateLastActiveAt,
  updateLastRenewAt
} from './authReducer';

describe('The auth reducer', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: 'TEST', payload: {} })).toEqual({
      lastActiveAt: expect.any(Number),
      lastRenewAt: expect.any(Number),
      groups: [],
      userGroupsSet: false
    });
  });

  it('handles updateLastActiveAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      groups: [],
      userGroupsSet: false
    };
    const now = DateTime.local();

    expect(
      authReducer(initialReducer, updateLastActiveAt(now)).lastActiveAt
    ).toEqual(now);
  });

  it('handles updateLastRenewAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      groups: [],
      userGroupsSet: false
    };
    const now = DateTime.local();

    expect(
      authReducer(initialReducer, updateLastRenewAt(now)).lastRenewAt
    ).toEqual(now);
  });

  it('handles setUserGroups', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      groups: [],
      userGroupsSet: false
    };
    const mockAction = setUserGroups(['my-test-group']);

    const newState = authReducer(initialReducer, mockAction);
    expect(newState.groups).toEqual(['my-test-group']);
    expect(newState.userGroupsSet).toEqual(true);
  });
});
