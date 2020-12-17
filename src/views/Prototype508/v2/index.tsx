import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import Footer from 'components/Footer';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import UploadPage from './pages/UploadPage';
import { ProjectsProvider } from './state';

import './index.scss';

const PrototypeFooter = () => {
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
    <div className="easi-page-wrapper">
      <Header />
      <ProjectsProvider>
        <div className="prototype-508">
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
          {false && <PrototypeFooter />}
        </div>
      </ProjectsProvider>
    </div>
  );
};

export default Prototype508;
