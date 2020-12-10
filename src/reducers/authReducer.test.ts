import { DateTime } from 'luxon';

import authReducer, {
  setUser,
  updateLastActiveAt,
  updateLastRenewAt
} from './authReducer';

describe('The auth reducer', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: 'TEST', payload: {} })).toEqual({
      lastActiveAt: expect.any(Number),
      lastRenewAt: expect.any(Number),
      name: '',
      euaId: '',
      groups: [],
      isUserSet: false
    });
  });

  it('handles updateLastActiveAt', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      name: '',
      euaId: '',
      groups: [],
      isUserSet: false
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
      name: '',
      euaId: '',
      groups: [],
      isUserSet: false
    };
    const now = DateTime.local();

    expect(
      authReducer(initialReducer, updateLastRenewAt(now)).lastRenewAt
    ).toEqual(now);
  });

  it('sets user info', () => {
    const initialReducer = {
      lastActiveAt: 0,
      lastRenewAt: 0,
      name: '',
      euaId: '',
      groups: [],
      isUserSet: false
    };
    const mockAction = setUser({
      name: 'Jane Smith',
      euaId: 'ABCD',
      groups: ['my-test-group']
    });

    const newState = authReducer(initialReducer, mockAction);
    expect(newState.name).toEqual('Jane Smith');
    expect(newState.euaId).toEqual('ABCD');
    expect(newState.groups).toEqual(['my-test-group']);
    expect(newState.isUserSet).toEqual(true);
  });
});
