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
      </div>
    </header>
  );
};

export default Header;
