import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Modal from 'components/Modal';

import { useGlobalState } from '../state';
import {
  Activity,
  ActivityType,
  DocumentType,
  Project,
  ProjectStatus
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

  const { state, updateProject } = useGlobalState();
  const project = state.projects[id];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState(project.status);
  const [noteContent, setNoteContent] = useState('');
  const [noteAlert, setNoteAlert] = useState('');

  if (!project) {
    return <main>Project not found</main>;
  }

  return (
    <>
      <div className="grid-container">
        <div className="easi-grt__request-summary grid-container padding-top-2">
          <BreadcrumbNav>
            <li>
              <Link className="text-white" to="/508/projects">
                Home
              </Link>
              <i className="fa fa-angle-right margin-x-05" aria-hidden />
            </li>
            <li>{project.name}</li>
          </BreadcrumbNav>
        </div>
      </div>
      <main
        id="main-content"
        className="easi-main-content grid-container margin-bottom-5"
      >
        <section className="easi-grt__request-summary">
          <div
            className="grid-container padding-bottom-2"
            style={{ overflow: 'auto' }}
          >
            <dl className="easi-grt__request-info">
              <div>
                <dt>Project Name</dt>
                <dd>
                  <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                    {project.name}
                  </h1>
                </dd>
              </div>
              <div className="easi-grt__request-info-col">
                <div className="easi-grt__description-group">
                  <dt>Submission Date</dt>
                  <dd>{project.submissionDate.toFormat('LLLL d y')}</dd>
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
                <dd>
                  <span
                    className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs"
                    data-testid="grt-status"
                  >
                    {project.status}
                  </span>
                  &nbsp;
                  <a
                    href="#tk"
                    className="usa-button usa-button--unstyled"
                    onClick={() => setModalIsOpen(true)}
                  >
                    Change Status
                  </a>
                </dd>
              </dl>
            </div>
          </div>
        </section>

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
            {Object.values(ProjectStatus).map(value => {
              const status = value as ProjectStatus;
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
            disabled={project.status === projectStatus}
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

        <h2>Project Details</h2>

        <div className="usa-prose">
          <p>{project.description}</p>
        </div>

        <hr className="system-intake__hr" />

        <h2>Documents</h2>

        {project.banner && (
          <div
            className="usa-alert usa-alert--success usa-alert--slim"
            role="alert"
          >
            <div className="usa-alert__body">
              <p className="usa-alert__text">{project.banner}</p>
            </div>
          </div>
        )}

        <Link to={`${pathname}/upload`}>Upload a document</Link>

        <Table bordered={false} fullWidth>
          <caption className="usa-sr-only">Documents</caption>
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
            {project.documents
              .sort((a, b) => b.createdAt.toSeconds() - a.createdAt.toSeconds())
              .map(document => {
                return (
                  <tr key={document.id}>
                    <td>{document.createdAt.toFormat('LLLL d y')}</td>
                    <td>
                      {document.type}{' '}
                      {document.type === DocumentType.TestResults && (
                        <span>- {document.score}%</span>
                      )}
                    </td>
                    <td>
                      <a href="#tk">
                        View{' '}
                        <span className="usa-sr-only">{document.type}</span>
                      </a>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => {
                          project.documents.splice(
                            project.documents.indexOf(document),
                            1
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
            className="usa-alert usa-alert--success usa-alert--slim"
            role="alert"
          >
            <div className="usa-alert__body">
              <p className="usa-alert__text">{noteAlert}</p>
            </div>
          </div>
        )}

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
            disabled={noteContent.trim().length === 0}
            onClick={() => {
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
            }}
          >
            Add Note
          </Button>
        </form>

        <ul className="easi-grt__note-list">
          {project.activities
            .sort((a, b) => b.createdAt.toSeconds() - a.createdAt.toSeconds())
            .map((activity: Activity) => {
              return (
                <li className="easi-grt__note" key={activity.id}>
                  <div className="easi-grt__note-content">
                    <p className="margin-top-0 margin-bottom-1 text-pre-wrap">
                      {activity.content}
                    </p>
                    <span className="text-base-dark font-body-2xs">
                      by {activity.authorName}
                      {' | '}
                      {activity.createdAt.toFormat('LLLL d y')}
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      </main>
    </>
  );
};

export default ProjectPage;
