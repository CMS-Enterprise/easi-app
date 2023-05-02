import configureMockStore from 'redux-mock-store';

import users, { MockEuaUserId } from 'data/mock/users';

type EasiMockStoreProps =
  | {
      euaUserId?: MockEuaUserId;
      isUserSet?: boolean;
      groups?: string[];
    }
  | undefined;

/**
 * Returns mock store for testing
 */
const easiMockStore = ({
  euaUserId = 'ABCD',
  isUserSet = true,
  groups
}: EasiMockStoreProps = {}) => {
  const mockStore = configureMockStore();
  const user = users.find(userInfo => userInfo.euaUserId === euaUserId)!;

  return mockStore({
    auth: {
      euaId: euaUserId,
      name: user.commonName,
      isUserSet,
      groups
    }
  });
};

export default easiMockStore;
