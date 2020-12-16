import React, { ReactEventHandler, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const storageKey = 'dev-user-config';

const DevLogin = () => {
  const history = useHistory();
  const [euaId, setEuaId] = useState('');
  const [jobCodes, setJobCodes] = useState({ EASI_D_GOVTEAM: true });

  useEffect(() => {
    if (window.localStorage[storageKey]) {
      history.push('/');
    }
  }, []);

  const checkboxChange: ReactEventHandler<HTMLInputElement> = event => {
    setJobCodes({
      ...jobCodes,
      [event.currentTarget.value as keyof typeof jobCodes]: event.currentTarget
        .checked
    });
  };

  const handleSubmit: ReactEventHandler = event => {
    event.preventDefault();
    const value = {
      euaId,
      jobCodes
    };
    localStorage.setItem(storageKey, JSON.stringify(value)); // ensure that the dev token is used
    history.push('/');
  };

  return (
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
          Enter a four-character EUA
          <br />
          <input
            type="text"
            maxLength={4}
            minLength={4}
            required
            value={euaId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEuaId(e.target.value.toUpperCase())
            }
            style={{ border: 'solid 1px orangered' }}
          />
        </label>
      </p>
      <fieldset
        style={{ display: 'inline-block', border: 'solid 1px orangered' }}
      >
        <legend>Select job codes</legend>
        {Object.keys(jobCodes).map(code => (
          <p key={code}>
            <label>
              <input
                type="checkbox"
                value={code}
                onChange={e => checkboxChange(e)}
                checked={jobCodes[code as keyof typeof jobCodes]}
              />
              {code}
            </label>
          </p>
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

export default DevLogin;
