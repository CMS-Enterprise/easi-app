import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="usa-header usa-header--basic" role="banner">
      <div className="usa-nav-container header-widescreen">
        <div className="usa-navbar">
          <div className="usa-logo" id="basic-logo">
            <em className="usa-logo__text">
              <a href="/" title="Home" aria-label="Home">
                EASi
              </a>
            </em>
          </div>
        </div>
        <nav className="usa-nav" aria-label="Primary navigation">
          <ul className="usa-nav__primary usa-accordion">
            <li className="usa-nav__primary-item">
              <a className="usa-nav__link" href="/">
                Welcome, Agent 007
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
