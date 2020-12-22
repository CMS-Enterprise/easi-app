import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { TabPanel } from '@cmsgov/design-system/dist/esnext/Tabs/TabPanel';
import { Tabs } from '@cmsgov/design-system/dist/esnext/Tabs/Tabs';
import {
  Button,
  DateInput,
  DateInputGroup,
  Fieldset,
  Table
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Modal from 'components/Modal';

import {
  ProgressIndicator,
  ProgressStatus,
  ProgressStep
} from '../components/Progress';
import useDocumentTitle from '../hooks/DocumentTitle';
import { useGlobalState } from '../state';
import { Document, DocumentType, Note, Project, RequestStep } from '../types';

import '@cmsgov/design-system/dist/css/index.css';
import './index.scss';

const DateField = ({ setDate }: { setDate: (date: DateTime) => void }) => {
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();

  useEffect(() => {
    const newDate = DateTime.local(year, month, day);
    setDate(newDate);
  }, [setDate, month, day, year]);

  return (
    <Fieldset legend="Test date">
      <span className="usa-hint" id="dateOfBirthHint">
        For example: 4 28 2020
      </span>
      <DateInputGroup>
        <DateInput
          id="testDateInput"
          name="testName"
          label="Month"
          unit="month"
          maxLength={2}
          minLength={2}
          value={month}
          onChange={e => setMonth(parseInt(e.target.value, 10))}
        />
        <DateInput
          id="testDateInput"
          name="testName"
          label="Day"
          unit="day"
          maxLength={2}
          minLength={2}
          value={day}
          onChange={e => setDay(parseInt(e.target.value, 10))}
        />
        <DateInput
          id="testDateInput"
          name="testName"
          label="Year"
          unit="year"
          maxLength={4}
          minLength={4}
          value={year}
          onChange={e => setYear(parseInt(e.target.value, 10))}
        />
      </DateInputGroup>
    </Fieldset>
  );
};

const AddTestDateModal = ({
  document,
  updateDocument
}: {
  document: Document;
  updateDocument: (document: Document) => void;
}) => {
  const [dateModalIsOpen, setDateModalIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="usa-button usa-button--unstyled"
        onClick={() => {
          setDateModalIsOpen(true);
        }}
      >
        Add date
      </button>

      <Modal
        title="Add a test date"
        isOpen={dateModalIsOpen}
        closeModal={() => {
          setDateModalIsOpen(false);
        }}
      >
        <DateField
          setDate={d => {
            document.testDate = d;
          }}
        />

        <button
          type="submit"
          className="usa-button"
          onClick={() => {
            updateDocument(document);
            setDateModalIsOpen(false);
          }}
        >
          Add date
        </button>
        <button
          type="button"
          className="usa-button usa-button--unstyled"
          onClick={() => {
            setDateModalIsOpen(false);
          }}
        >
          Don&rsquo;t add a test date
        </button>
      </Modal>
    </>
  );
};

const documentName = (doc: Document) => {
  if (doc.type === DocumentType.Other) {
    return doc.otherName || '';
  }
  return doc.type.toString();
};

const DocumentTable = ({
  project,
  updateProject,
  setDocumentAlert
}: {
  project: Project;
  updateProject: (project: Project) => void;
  setDocumentAlert: (message: string) => void;
}) => {
  return (
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
          <th scope="col" style={{ whiteSpace: 'nowrap' }}>
            Test Date
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {project.documents
          .sort((a, b) => a.createdAt.toSeconds() - b.createdAt.toSeconds())
          .map(doc => {
            return (
              <tr key={doc.id}>
                <th scope="row">
                  {documentName(doc)}{' '}
                  {doc.type === DocumentType.TestResults && (
                    <span>- {doc.score}%</span>
                  )}
                </th>
                <td>{doc.createdAt.toFormat('LLLL d y')}</td>
                <td>
                  {doc.testDate ? (
                    doc.testDate.toFormat('LLLL d y')
                  ) : (
                    <AddTestDateModal
                      document={doc}
                      updateDocument={() => updateProject(project)}
                    />
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="usa-button usa-button--unstyled margin-right-2"
                  >
                    View{' '}
                    <span className="usa-sr-only">{documentName(doc)}</span>
                  </button>
                  <button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => {
                      project.documents.splice(
                        project.documents.indexOf(doc),
                        1
                      );
                      setDocumentAlert(
                        `${documentName(doc)} was removed from the project.`
                      );
                      updateProject(project);
                    }}
                  >
                    Remove{' '}
                    <span className="usa-sr-only">{documentName(doc)}</span>
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
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
        </div>

        <Modal
          title="Change Project Status"
          isOpen={modalIsOpen}
          closeModal={() => {
            setModalIsOpen(false);
          }}
          className="change-status-modal"
        >
          <fieldset className="usa-fieldset">
            <legend className="margin-bottom-2 text-bold">
              Choose project status for {project.name}
            </legend>
            {Object.values(RequestStep).map(value => {
              const status = value as RequestStep;
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

                    {[
                      RequestStep.TestScheduled,
                      RequestStep.RemediationInProgress,
                      RequestStep.ValidationTestingScheduled
                    ].includes(status) &&
                      projectStatus === status && (
                        <div className="width-card-lg margin-top-neg-2 margin-left-4 margin-bottom-1">
                          <DateField
                            setDate={d => {
                              console.debug(d);
                            }}
                          />
                        </div>
                      )}
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
          <div className="grid-row grid-gap-lg">
            <div className="grid-col-8">
              <Tabs>
                <TabPanel id="documents" tab="Documents">
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

                  <button
                    type="button"
                    className="usa-button"
                    onClick={() => {
                      history.push(`${pathname}/upload`);
                    }}
                  >
                    Upload a document
                  </button>

                  <DocumentTable
                    project={project}
                    updateProject={updateProject}
                    setDocumentAlert={setDocumentAlert}
                  />
                </TabPanel>
                <TabPanel id="notes" tab="Notes">
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
                          project.notes.push({
                            id: Math.round(Math.random() * 10000000),
                            content: noteContent,
                            createdAt: DateTime.local(),
                            authorName: 'Aaron Allen'
                          });
                          updateProject(project);
                          setNoteContent('');
                          setNoteAlert(
                            `Note added to ${project.name} project page.`
                          );
                        }
                      }}
                    >
                      Add Note
                    </Button>
                  </form>

                  <ul
                    className="easi-grt__note-list"
                    aria-label={`This is a list of all activity on ${project.name}.`}
                  >
                    {project.notes
                      .sort(
                        (a, b) =>
                          b.createdAt.toSeconds() - a.createdAt.toSeconds()
                      )
                      .map((activity: Note) => {
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
                </TabPanel>
                <TabPanel id="details" tab="Details and Past Requests">
                  <p>Past releases</p>
                </TabPanel>
              </Tabs>

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
            </div>
            <div className="grid-col-4">
              <div
                className="easi-grt__status-info text-gray-90 padding-top-1 padding-bottom-1"
                aria-label={`Status for ${project.name}`}
              >
                <span className="text-bold">Status</span>
                <br />
                <span
                  className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs margin-right-1"
                  data-testid="grt-status"
                >
                  {project.status}
                </span>
                <br />
                <button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setModalIsOpen(true)}
                >
                  Change Status
                </button>
                <hr />
                <span className="text-bold margin-right-1">
                  Point of contact
                </span>
                <br />
                <span>{project.pointOfContact.name}</span>
                <br />
                <button
                  type="button"
                  className="usa-button usa-button--unstyled"
                >
                  Update
                </button>
                <hr />
                <h3>Timeline</h3>
                <ProgressIndicator>
                  {Object.values(RequestStep).map(value => {
                    const step = value as RequestStep;
                    const status = project.stepStatuses[step] || {
                      date: DateTime.fromISO('2020-11-25'),
                      status: ProgressStatus.ToDo
                    };

                    return (
                      <ProgressStep
                        name={step}
                        optionalLabel={
                          [
                            RequestStep.TestScheduled,
                            RequestStep.RemediationInProgress,
                            RequestStep.ValidationTestingScheduled
                          ].includes(step)
                            ? status.date.toFormat('LLLL d y')
                            : undefined
                        }
                        status={status.status}
                      />
                    );
                  })}
                </ProgressIndicator>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProjectPage;
