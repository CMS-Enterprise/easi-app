import React, { useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { Button, Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Modal from 'components/Modal';

import './index.scss';

enum DocumentType {
  TestPlan,
  TestingVPAT,
  TestResults,
  AwardedVPAT,
  RemediationPlan
}

type Document = {
  type: DocumentType;
  mimetype: string;
  createdAt: DateTime;
};

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

enum ActivityType {
  NoteAdded,
  StatusChanged,
  DocumentAdded,
  DocumentRemoved,
  ProjectCreated
}

export type Activity = {
  authorName: string;
  content: string;
  createdAt: DateTime;
  type: ActivityType;
};

type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
  businessOwner: BusinessOwner;
  submissionDate: DateTime;
  lastUpdatedAt: DateTime;
  lifecycleID: string;
  description?: string;
  documents: Document[];
  activities: Activity[];
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
    },
    lifecycleID: 'X200943',
    documents: [
      {
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-09')
      },
      {
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-09')
      },
      {
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-09')
      }
    ],
    activities: [
      {
        content: 'Status changed to Testing in progress',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.StatusChanged,
        authorName: 'Aaron Allen'
      },
      {
        content: 'VPAT uploaded',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        content: 'Test plan uploaded',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        content:
          'We are waiting on the test plan and VPAT from business owner.',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.NoteAdded,
        authorName: 'Aaron Allen'
      },
      {
        content: 'Awarded VPAT uploaded',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        content: 'TACO project created',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.ProjectCreated,
        authorName: 'Aaron Allen'
      }
    ],
    description:
      'TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience.'
  },
  {
    id: 2,
    name: 'Impact Analysis Network',
    status: ProjectStatus.TestingRequested,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Shane Clark'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  {
    id: 3,
    name: 'Migration Pipeline',
    status: ProjectStatus.TestingInProgress,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Connie Leonard'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  {
    id: 4,
    name: '(USDS) Dashboard for USDS',
    status: ProjectStatus.TestingCompleted,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Ada Sanchez'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  {
    id: 5,
    name: 'OSORA FOIA Portal Project',
    status: ProjectStatus.InRemediation,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Amanda Johnson'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
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
                <td>{project.submissionDate.toLocaleString()}</td>
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
    </main>
  );
};

const ProjectPage = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id.toString() === id);

  const [modelIsOpen, setModalIsOpen] = useState(true);

  if (!project) {
    return <main>Project not found</main>;
  }

  return (
    <main id="main-content">
      <section className="easi-grt__request-summary">
        <div className="grid-container padding-y-2">
          <BreadcrumbNav>
            <li>
              <Link className="text-white" to="/508/projects">
                Home
              </Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>{project.name}</li>
          </BreadcrumbNav>
          <dl className="easi-grt__request-info">
            <div>
              <dt>Project Name</dt>
              <dd>{project.name}</dd>
            </div>
            <div className="easi-grt__request-info-col">
              <div className="easi-grt__description-group">
                <dt>Submission Date</dt>
                <dd>{project.submissionDate.toLocaleString()}</dd>
              </div>
              <div className="easi-grt__description-group">
                <dt>Business Owner</dt>
                <dd>{project.businessOwner.name}</dd>
              </div>
              <div className="easi-grt__description-group">
                <dt>Lifecycle ID</dt>
                <dd>{project.lifecycleID}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="easi-grt__status--open">
          <div className="grid-container overflow-auto">
            <dl className="easi-grt__status-info text-gray-90">
              <dt className="text-bold">Status</dt>
              &nbsp;
              <dd
                className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs"
                data-testid="grt-status"
              >
                {ProjectStatus[project.status]}
              </dd>
            </dl>
          </div>
        </div>
      </section>

      <h2>Project Details</h2>

      <div className="usa-prose">
        <p>{project.description}</p>
      </div>

      <hr className="system-intake__hr" />

      <h2>Documents</h2>

      <button
        type="button"
        className="usa-button usa-button--unstyled"
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        Upload a document
      </button>

      <Table bordered={false} fullWidth>
        <caption className="usa-sr-only">Downloads</caption>
        <thead>
          <tr>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Date Uploaded
            </th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Document
            </th>
          </tr>
        </thead>
        <tbody>
          {project.documents.map(document => {
            return (
              <tr>
                <td>{document.createdAt.toLocaleString()}</td>
                <td>{DocumentType[document.type]}</td>
                <td>
                  <a href="#tk">View {DocumentType[document.type]}</a>
                </td>
                <td>
                  <a href="#tk">Remove {DocumentType[document.type]}</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <h2>Project Activity</h2>
      {/* <Form onSubmit={() => {}}> */}
      <form>
        <label>
          Add Note
          <br />
          <textarea />
        </label>
        <Button className="margin-top-2" type="submit" disabled={false}>
          Add Note
        </Button>
      </form>
      {/* </Form> */}
      <ul className="easi-grt__note-list">
        {project.activities.map((activity: Activity) => {
          return (
            <li className="easi-grt__note" key={activity.id}>
              <div className="easi-grt__note-content">
                <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
                  {activity.content}
                </p>
                <span className="text-base-dark font-body-2xs">{`by: ${
                  activity.authorName
                } | ${activity.createdAt.toLocaleString(
                  DateTime.DATE_FULL
                )} at ${activity.createdAt.toLocaleString(
                  DateTime.TIME_SIMPLE
                )}`}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <Modal
        title="Upload a Document"
        isOpen={modelIsOpen}
        closeModal={() => {
          setModalIsOpen(false);
        }}
      >
        <DocumentUploader />
      </Modal>
    </main>
  );
};

const DocumentUploader = () => {
  const [file, setFile] = useState('');
  if (file !== '') {
    return (
      <div className="usa-file-input">
        <div className="usa-file-input__target">
          <div className="usa-file-input__preview-heading">
            Selected file{' '}
            <button
              type="button"
              className="usa-file-input__choose usa-button--unstyled"
              onClick={() => {
                setFile('');
              }}
            >
              Change file
            </button>
          </div>

          <div
            className="usa-file-input__instructions display-none"
            aria-hidden="true"
          >
            <span className="usa-file-input__drag-text">
              Drag file here or{' '}
            </span>
            <span className="usa-file-input__choose">choose from folder</span>
          </div>

          <div className="usa-file-input__preview" aria-hidden="true">
            <img
              id="fonts__2ecss"
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt=""
              className="usa-file-input__preview-image usa-file-input__preview-image--generic"
            />
            {file}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="usa-form-group">
      <label className="usa-label" htmlFor="file-input-single">
        Choose a document to upload
      </label>
      <div className="usa-prose">
        <p>This document can be a PDF or DOC and can be no larger than 5 MB.</p>
      </div>
      <div className="usa-file-input">
        <div className="usa-file-input__target">
          <div className="usa-file-input__instructions" aria-hidden="true">
            <span className="usa-file-input__drag-text">
              Drag file here or{' '}
            </span>
            <span className="usa-file-input__choose">choose from folder</span>
          </div>
          <div className="usa-file-input__box" />
          <input
            id="file-input-single"
            className="usa-file-input__input"
            type="file"
            name="file-input-single"
            onChange={e => {
              if (e.target.files) {
                setFile(e.target.files[0].name);
              }
            }}
          />
        </div>
      </div>
    </div>
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
