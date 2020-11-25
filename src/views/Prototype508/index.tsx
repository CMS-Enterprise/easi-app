import React from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import './index.scss';

// type Document = {
//   name: string;
//   filename: string;
//   mimetype: string;
//   createdAt: DateTime;
// };

enum ProjectStatus {
  ConsultRequested,
  TestingRequested,
  TestingInProgress,
  TestingCompleted,
  InRemediation
}

type BusinessOwner = {
  name: string;
};

type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
  businessOwner: BusinessOwner;
  submissionDate: DateTime;
  lastUpdatedAt: DateTime;
};

// TODO needs to be at least 15
const projects: Project[] = [
  {
    id: 1,
    name: 'TACO',
    status: ProjectStatus.ConsultRequested,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Shane Clark'
    }
  },
  {
    id: 2,
    name: 'Impact Analysis Network',
    status: ProjectStatus.TestingRequested,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Shane Clark'
    }
  },
  {
    id: 3,
    name: 'Migration Pipeline',
    status: ProjectStatus.TestingInProgress,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Connie Leonard'
    }
  },
  {
    id: 4,
    name: '(USDS) Dashboard for USDS',
    status: ProjectStatus.TestingCompleted,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Ada Sanchez'
    }
  },
  {
    id: 5,
    name: 'OSORA FOIA Portal Project',
    status: ProjectStatus.InRemediation,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Amanda Johnson'
    }
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
    <main id="main-content">
      <Table bordered={false} fullWidth>
        <caption className="usa-sr-only">Requests</caption>
        <thead>
          <tr>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Submission Date
            </th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Project Name
            </th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Business Owner
            </th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            return (
              <tr key={project.id}>
                <th scope="row">{project.submissionDate.toLocaleString()}</th>
                <td>
                  <Link to={`projects/${project.id}`}>{project.name}</Link>
                </td>
                <td>{project.businessOwner.name}</td>
                <td>
                  <strong>{ProjectStatus[project.status]}</strong>
                  <br />
                  last updated at {project.lastUpdatedAt.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <ul />
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
