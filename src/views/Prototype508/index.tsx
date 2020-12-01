import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import UploadPage from './pages/UploadPage';

import './index.scss';

const Header = () => {
  return (
    <header>
      <h1>EASi/Scylla Prototype</h1>
    </header>
  );
};

const Footer = () => {
  const { path } = useRouteMatch();

  return (
    <footer>
      <nav role="navigation">
        <h2>Prototype pages</h2>
        <ul>
          <li>
            <Link to={`${path}/login`}>Login</Link>
          </li>
          <li>
            <Link to={`${path}/projects`}>Projects</Link>
          </li>
          <li>
            <Link to={`${path}/projects/1`}>Project</Link>
          </li>
          <li>
            <Link to={`${path}/projects/1/upload`}>Upload</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

const Prototype508 = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <div className="grid-container prototype-508">
        <Header />
        <section className="content">
          <Switch>
            <Route path={`${path}/login`} component={LoginPage} />
            <Route
              path={`${path}/projects/:id/upload`}
              component={UploadPage}
            />
            <Route path={`${path}/projects/:id`} component={ProjectPage} />
            <Route path={`${path}/projects`} exact component={ProjectsPage} />
          </Switch>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Prototype508;
