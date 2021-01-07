import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import Footer from 'components/Footer';

import Header from './components/Header';
import InRemediationPage from './pages/InRemediationPage';
import LoginPage from './pages/LoginPage';
import NotImplementedPage from './pages/NotImplemented';
import RequestPage from './pages/RequestPage';
import RequestsPage from './pages/RequestsPage';
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
            <Link to={`${path}/requests`}>Requests</Link>
          </li>
          <li>
            <Link to={`${path}/requests/1`}>Project</Link>
          </li>
          <li>
            <Link to={`${path}/requests/1/upload`}>Upload</Link>
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
                path={`${path}/requests/:id/upload`}
                component={UploadPage}
              />
              <Route path={`${path}/requests/:id`} component={RequestPage} />
              <Route path={`${path}/requests`} exact component={RequestsPage} />
              <Route
                path={`${path}/remediation`}
                exact
                component={InRemediationPage}
              />
              <Route
                path={`${path}/not-implemented`}
                exact
                component={NotImplementedPage}
              />
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
