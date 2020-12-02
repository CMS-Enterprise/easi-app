import React from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const history = useHistory();

  return (
    <main
      id="main-content"
      className="easi-main-content grid-container margin-bottom-5"
    >
      <h1>Login to Scylla</h1>
      <form className="usa-form">
        <label className="usa-label" htmlFor="input-type-eua">
          EUA
        </label>
        <input
          className="usa-input"
          id="input-type-eua"
          name="input-type-eua"
          type="text"
        />
        <label className="usa-label" htmlFor="input-type-password">
          Password
        </label>
        <input
          className="usa-input"
          id="input-type-password"
          name="input-type-password"
          type="password"
        />

        <button
          type="submit"
          className="usa-button"
          onClick={() => history.push('projects')}
        >
          Login
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
