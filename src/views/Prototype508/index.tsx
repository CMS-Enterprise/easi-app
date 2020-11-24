import React from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { DateTime } from 'luxon';

import './index.scss';

type Document = {
  name: string;
  filename: string;
  mimetype: string;
  createdAt: DateTime;
};

enum ProjectStatus {
  New,
  Step1,
  Step2
}

type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
  documents: Document[];
};

const projects: Project[] = [
  {
    id: 1,
    name: 'Project A',
    status: ProjectStatus.New,
    documents: []
  },
  {
    id: 2,
    name: 'Project B',
    status: ProjectStatus.Step1,
    documents: []
  }
];

const Header = () => {
  return (
    <header>
      <h1>EASi/Scylla Prototype</h1>
    </header>
  );
};

const Login = () => {
  const history = useHistory();

  return (
    <main>
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

const ProjectsPage = () => {
  return (
    <main>
      <table className="usa-table">
        <caption>Projects</caption>
        <thead>
          <tr>
            <th scope="col">Project name</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            return (
              <tr key={project.id}>
                <th scope="row">
                  <Link to={`projects/${project.id}`}>{project.name}</Link>
                </th>
                <td>{ProjectStatus[project.status]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

const ProjectPage = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id.toString() === id);

  if (!project) {
    return <main>Project not found</main>;
  }

  return (
    <main>
      <h1>{project.name}</h1>
    </main>
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
