import React, { Fragment, ReactEventHandler, useState } from 'react';

import JOB_CODES from 'constants/jobCodes';
import { localAuthStorageKey } from 'constants/localAuth';

const DevLogin = () => {
  const availableJobCodes: any = JOB_CODES.reduce(
    (codes: any, code: any) => ({ ...codes, [code]: false }),
    {}
  );

  const [euaId, setEuaId] = useState('');
  const [jobCodes, setJobCodes] = useState(availableJobCodes);

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
      jobCodes: Object.keys(jobCodes).filter(
        key => jobCodes[key as keyof typeof jobCodes]
      ),
      favorLocalAuth: true
    };
    localStorage.setItem(localAuthStorageKey, JSON.stringify(value));
    window.location.href = '/';
  };

  return (
    <form onSubmit={handleSubmit}>
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
            data-testid="LocalAuth-EUA"
          />
        </label>
      </p>
      <fieldset
        style={{ display: 'inline-block', border: 'solid 1px orangered' }}
      >
        <legend>Select job codes</legend>
        {Object.keys(jobCodes).map(code => (
          <Fragment key={code}>
            <label>
              <input
                type="checkbox"
                value={code}
                onChange={checkboxChange}
                checked={jobCodes[code as keyof typeof jobCodes]}
              />
              {code}
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
          data-testid="LocalAuth-Submit"
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default DevLogin;
