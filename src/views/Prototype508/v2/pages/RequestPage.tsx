import React, { useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

import Modal from 'components/Modal';

import useDocumentTitle from '../hooks/DocumentTitle';
import { useGlobalState } from '../state';
import {
  Activity,
  ActivityType,
  DocumentType,
  Project,
  RequestStatus
} from '../types';

const addActivity = (project: Project, content: string) => {
  project.activities.push({
    id: Math.round(Math.random() * 10000000),
    createdAt: DateTime.local(),
    authorName: 'Aaron Allen',
    type: ActivityType.StatusChanged,
    content
  });
};

const ProjectPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();

  const { state, updateProject } = useGlobalState();
  const project = state.projects[id];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState(project.status);
  const [noteContent, setNoteContent] = useState('');
  const [noteAlert, setNoteAlert] = useState('');
  const [documentAlert, setDocumentAlert] = useState('');

  useDocumentTitle(`EASi: Project page for ${project && project.name}`);

  if (!project) {
    return <main>Project not found</main>;
  }

  return (
    <>
      <main
        id="main-content"
        className="easi-main-content margin-bottom-5"
        aria-label={`Project page for ${project.name}`}
      >
        <div className="grid-container">
          <Link to="/v2/requests">Back to Active Requests</Link>

          <h1>{project.name}</h1>

          <div
            className="easi-grt__status-info text-gray-90 padding-top-1 padding-bottom-1"
            aria-label={`Status for ${project.name}`}
          >
            <span className="text-bold margin-right-1">Status</span>
            <span
              className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs margin-right-1"
              data-testid="grt-status"
            >
              {project.status}
            </span>
            <button
              type="button"
              className="usa-button usa-button--unstyled margin-left-3"
              onClick={() => setModalIsOpen(true)}
            >
              Change Status
            </button>
            <span className="text-bold margin-right-1">Point of contact</span>
            <span>{project.pointOfContact.name}</span>
            <button
              type="button"
              className="usa-button usa-button--unstyled margin-left-3"
            >
              Update
            </button>
            <br />
            Last updated on {project.lastUpdatedAt.toFormat('LLLL d y')}
          </div>

          <div className="usa-step-indicator" aria-label="progress">
            <ol className="usa-step-indicator__segments">
              {Object.values(RequestStatus).map(value => {
                const status = value as RequestStatus;
                const completed =
                  Object.values(RequestStatus).indexOf(value) <=
                  Object.values(RequestStatus).indexOf(project.status);
                return (
                  <li
                    className={classnames({
                      'usa-step-indicator__segment': true,
                      'usa-step-indicator__segment--complete': completed
                    })}
                  >
                    <span className="usa-step-indicator__segment-label">
                      {status}{' '}
                      {completed && (
                        <span className="usa-sr-only">completed</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <Modal
          title="Change Project Status"
          isOpen={modalIsOpen}
          closeModal={() => {
            setModalIsOpen(false);
          }}
        >
          <fieldset className="usa-fieldset">
            <legend className="margin-bottom-2 text-bold">
              Choose project status for {project.name}
            </legend>
            {Object.values(RequestStatus).map(value => {
              const status = value as RequestStatus;
              return (
                <>
                  <div className="usa-radio">
                    <input
                      className="usa-radio__input"
                      id={`input-${status}`}
                      type="radio"
                      name="document-type"
                      value={status}
                      checked={projectStatus === status}
                      onChange={() => {
                        setProjectStatus(status);
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`input-${status}`}
                    >
                      {status}
                      {project.status === status && ' (current status)'}
                    </label>
                  </div>
                </>
              );
            })}
          </fieldset>

          <p className="usa-prose">
            Changing the project status will send an email to all members of the
            508 team letting them know about the new status.
          </p>

          <button
            type="submit"
            className="usa-button"
            onClick={() => {
              addActivity(project, `Status changed to ${projectStatus}.`);
              project.status = projectStatus;
              updateProject(project);
              setModalIsOpen(false);
            }}
          >
            Change status and send email
          </button>
          <button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => {
              setModalIsOpen(false);
            }}
          >
            Don&rsquo;t change projects status
          </button>
        </Modal>

        <div className="grid-container">
          <h2>Documents</h2>

          {documentAlert !== '' && (
            <div
              className="usa-alert usa-alert--success usa-alert--slim margin-bottom-2"
              role="alert"
            >
              <div className="usa-alert__body">
                <p className="usa-alert__text">{documentAlert}</p>
              </div>
            </div>
          )}

          {project.banner && (
            <div
              className="usa-alert usa-alert--success usa-alert--slim margin-bottom-2"
              role="alert"
            >
              <div className="usa-alert__body">
                <p className="usa-alert__text">{project.banner}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            className="usa-button usa-button--unstyled"
            onClick={() => {
              history.push(`${pathname}/upload`);
            }}
          >
            Upload a document
          </button>

          <Table bordered={false} fullWidth>
            <caption className="usa-sr-only">
              List of documents uploaded for {project.name}
            </caption>
            <thead>
              <tr>
                <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                  Document
                </th>
                <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                  Date Uploaded
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.documents
                .sort(
                  (a, b) => a.createdAt.toSeconds() - b.createdAt.toSeconds()
                )
                .map(document => {
                  return (
                    <tr key={document.id}>
                      <th scope="row">
                        {document.type}{' '}
                        {document.type === DocumentType.TestResults && (
                          <span>- {document.score}%</span>
                        )}
                      </th>
                      <td>{document.createdAt.toFormat('LLLL d y')}</td>

                      <td>
                        <button
                          type="button"
                          className="usa-button usa-button--unstyled margin-right-2"
                        >
                          View{' '}
                          <span className="usa-sr-only">{document.type}</span>
                        </button>
                        <button
                          type="button"
                          className="usa-button usa-button--unstyled"
                          onClick={() => {
                            project.documents.splice(
                              project.documents.indexOf(document),
                              1
                            );
                            setDocumentAlert(
                              `The ${document.type} document was removed from the project.`
                            );
                            updateProject(project);
                          }}
                        >
                          Remove{' '}
                          <span className="usa-sr-only">{document.type}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>

          <h2>Project Activity</h2>

          {noteAlert !== '' && (
            <div
              className="usa-alert usa-alert--success usa-alert--slim margin-bottom-2"
              role="alert"
            >
              <div className="usa-alert__body">
                <p className="usa-alert__text">{noteAlert}</p>
              </div>
            </div>
          )}

          <ul
            className="easi-grt__note-list"
            aria-label={`This is a list of all activity on ${project.name}.`}
          >
            {project.activities
              .sort((a, b) => a.createdAt.toSeconds() - b.createdAt.toSeconds())
              .map((activity: Activity) => {
                return (
                  <li className="easi-grt__note" key={activity.id}>
                    <div className="easi-grt__note-content">
                      <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
                        {activity.content}
                      </p>
                      <span className="text-base-dark font-body-2xs">
                        by {activity.authorName}
                        <span aria-hidden="true">{' | '}</span>
                        {activity.createdAt.toFormat('LLLL d y')}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>

          <form>
            <label className="usa-label" htmlFor="input-type-textarea">
              Add note
            </label>
            <textarea
              className="usa-textarea"
              id="input-type-textarea"
              name="input-type-textarea"
              value={noteContent}
              onChange={e => {
                setNoteContent(e.target.value);
              }}
              style={{ height: '100px' }}
            />

            <Button
              className="margin-top-2"
              type="button"
              onClick={() => {
                if (noteContent.trim().length > 0) {
                  project.activities.push({
                    id: Math.round(Math.random() * 10000000),
                    content: noteContent,
                    createdAt: DateTime.local(),
                    authorName: 'Aaron Allen',
                    type: ActivityType.NoteAdded
                  });
                  updateProject(project);
                  setNoteContent('');
                  setNoteAlert(`Note added to ${project.name} project page.`);
                }
              }}
            >
              Add Note
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default ProjectPage;
