/* eslint-disable no-underscore-dangle */

import users, {
  MockEuaUserId,
  MockUserInfo,
  MockUserName
} from 'tests/mock/users';

export interface MockUser {
  userInfo: MockUserInfo;
}

type UserProps<T extends MockUser> =
  | ((userInfo: MockUserInfo) => Partial<Omit<T, 'userInfo'>>)
  | Partial<Omit<T, 'userInfo'>>;

export type MockUserOptions<T extends MockUser> =
  | {
      /** Whether class will return duplicate users - defaults to false */
      allowDuplicates?: boolean;
      /** Default user props */
      defaultProps?: UserProps<T>;
    }
  | undefined;

export class MockUsers<
  UserType extends MockUser = MockUser
> extends Array<UserType> {
  _currentIndex: number = 0;

  _allowDuplicates: boolean;

  constructor({
    allowDuplicates = false,
    defaultProps
  }: MockUserOptions<UserType> = {}) {
    super(
      ...(users.map(userInfo => ({
        userInfo,
        ...(typeof defaultProps === 'function'
          ? defaultProps?.(userInfo)
          : defaultProps)
      })) as UserType[])
    );
    this._allowDuplicates = allowDuplicates;
  }

  /** Remove user from array if `allowDuplicates` prop is set to false */
  removeUser(index: number) {
    this.splice(index, 1);

    // Reset `currentIndex` to reflect new array size
    if (index < this._currentIndex) {
      this._currentIndex -= 1;
    }
  }

  /** Get next user in array */
  next(props?: UserProps<UserType>): UserType | undefined {
    let user: UserType | undefined;

    if (this._allowDuplicates) {
      // If past end of array, reset `currentIndex` to 0
      if (this._currentIndex > this.length) {
        this._currentIndex = 0;
      }
      user = { ...this[this._currentIndex], ...props };
      this._currentIndex += 1;
    } else {
      // If past end of array, return undefined
      if (this._currentIndex > this.length) {
        return undefined;
      }
      user = { ...this[this._currentIndex], ...props };
      this.removeUser(this._currentIndex);
    }

    return user;
  }

  /** Get user by commonName */
  findByCommonName(
    commonName: MockUserName,
    props?: UserProps<UserType>
  ): UserType | undefined {
    const userIndex = this.findIndex(
      ({ userInfo }) => userInfo.commonName === commonName
    );

    if (userIndex === -1) return undefined;

    const user = { ...this[userIndex], ...props };

    if (!this._allowDuplicates) {
      this.removeUser(userIndex);
    }

    return user;
  }

  /** Get user by euaUserId */
  findByEuaUserId(
    euaUserId: MockEuaUserId,
    props?: UserProps<UserType>
  ): UserType | undefined {
    const userIndex = this.findIndex(
      ({ userInfo }) => userInfo.euaUserId === euaUserId
    );

    if (userIndex === -1) return undefined;

    const user = { ...this[userIndex], ...props };

    if (!this._allowDuplicates) {
      this.removeUser(userIndex);
    }

    return user;
  }
}

export default MockUsers;
