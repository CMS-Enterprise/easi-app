import React, { Fragment, useEffect, useState } from 'react';
import { OktaContext } from '@okta/okta-react';

const storageKey = 'dev-user-config';

const jobCodes = ['EASI_D_GOVTEAM', 'EASI_P_GOVTEAM'];
type EuaJobCodes = typeof jobCodes[number];
type EuaJobCodeMap = { [jobCode in EuaJobCodes]: boolean };

const initialAuthState = {
  isAuthenticated: false,
  isPending: false
};

type ParentComponentProps = {
  children: React.ReactNode;
};

const DevSecurity = ({ children }: ParentComponentProps) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isPending: boolean;
  }>(initialAuthState);
  const [euaId, setEuaId] = useState('');
  const [groups, setGroups] = useState<EuaJobCodeMap>({
    EASI_D_GOVTEAM: false,
    EASI_P_GOVTEAM: false
  });

  const authService = {
    login: () => {},
    logout: () => {
      window.localStorage.removeItem(storageKey);
      window.location.href = '/';
    },
    getUser: () => {
      return Promise.resolve({ name: `User ${euaId}` });
    },
    getTokenManager: () => {
      return {
        off: () => {},
        on: () => {},
        renew: () => {}
      };
    }
  };

  useEffect(() => {
    if (window.localStorage[storageKey]) {
      const state = JSON.parse(window.localStorage[storageKey]);
      setAuthState(prevAuthState => {
        return {
          ...prevAuthState,
          isAuthenticated: true
        };
      });
      setEuaId(state.eua);
      setGroups(state.jobCodes);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const activeGroups = jobCodes.filter(group => groups[group]);
    const value = {
      eua: euaId,
      jobCodes: activeGroups
    };
    localStorage.setItem(storageKey, JSON.stringify(value));
    localStorage.removeItem('okta-token-storage'); // ensure that the dev token is used
    setAuthState({
      ...authState,
      isAuthenticated: true
    });
  };

  const checkboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setGroups(prevGroups => {
      return {
        ...prevGroups,
        [event.target.value]: event.target.checked
      };
    });
  };

  const mockOktaAuthState = {
    name: `User ${euaId}`,
    euaId,
    groups: jobCodes.filter(group => groups[group]),
    isPending: authState.isPending,
    isAuthenticated: authState.isAuthenticated
  };

  return authState.isAuthenticated ? (
    <OktaContext.Provider value={{ authService, authState: mockOktaAuthState }}>
      {children}
    </OktaContext.Provider>
  ) : (
    <form onSubmit={handleSubmit} style={{ padding: '1rem 3rem' }}>
      <h1
        style={{
          backgroundImage: 'linear-gradient(to left, orange, red)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        Dev auth
      </h1>
      <p>
        <label>
          Enter an EUA
          <br />
          <input
            type="text"
            maxLength={4}
            minLength={4}
            required
            value={euaId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.persist();
              setEuaId(e.target.value.toUpperCase());
            }}
            style={{ border: 'solid 1px orangered' }}
          />
        </label>
      </p>
      <fieldset
        style={{ display: 'inline-block', border: 'solid 1px orangered' }}
      >
        <legend>Select job codes</legend>
        {Object.keys(groups).map(group => (
          <Fragment key={group}>
            <label>
              <input
                type="checkbox"
                value={group}
                onChange={checkboxChange}
                checked={groups[group]}
              />
              {group}
            </label>
            <br />
          </Fragment>
        ))}
      </fieldset>
      <p>
        <button
          type="submit"
          style={{
            backgroundImage: 'linear-gradient(to left, orange, red)',
            color: 'white',
            fontWeight: 'bold',
            border: 0,
            padding: '.3rem 1rem',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default DevSecurity;
