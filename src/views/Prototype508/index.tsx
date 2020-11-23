import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { DateTime } from 'luxon';

import './index.scss';

type Document = {
  name: string;
  filename: string;
  mimetype: string;
  createdAt: DateTime;
};

type Project = {
  name: string;
  status: string;
  documents: Document[];
};

const Header = () => {
  return (
    <header>
      <h1>EASi/Scylla Prototype</h1>
    </header>
  );
};

const Login = () => {
  return <main>login</main>;
};

const ProjectsPage = () => {
  return <main>projects</main>;
};

const ProjectPage = () => {
  return <main>project</main>;
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
        </ul>
      </nav>
    </footer>
  );
};

const Prototype508 = () => {
  const project: Project = { name: 'Project A', status: 'new', documents: [] };
  console.log(project);
  const { path } = useRouteMatch();

  return (
    <>
      <div className="grid-container prototype-508">
        <Header />
        <section className="content">
          <Switch>
            <Route path={`${path}/login`} component={Login} />
            <Route path={`${path}/projects`} exact component={ProjectsPage} />
            <Route path={`${path}/projects/:id`} component={ProjectPage} />
          </Switch>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Prototype508;
