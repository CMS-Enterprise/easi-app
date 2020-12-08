import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import useDocumentTitle from '../hooks/DocumentTitle';
import { useGlobalState } from '../state';
import { ActivityType, DocumentType, Project, ProjectStatus } from '../types';

const addDocument = (project: Project, type: DocumentType, score: string) => {
  project.documents.push({
    id: Math.round(Math.random() * 10000000),
    mimetype: 'application/pdf',
    createdAt: DateTime.local(),
    type,
    score: parseInt(score, 10)
  });
  project.activities.push({
    id: Math.round(Math.random() * 10000000),
    content:
      type === DocumentType.TestResults
        ? `${type} uploaded - ${score}%`
        : `${type} uploaded`,
    createdAt: DateTime.local(),
    authorName: 'Katrina Berkley',
    type: ActivityType.DocumentAdded
  });
  project.banner = `${type} uploaded to ${project.name} project page.`; // eslint-disable-line no-param-reassign
};

const addActivity = (project: Project, content: string) => {
  project.activities.push({
    id: Math.round(Math.random() * 10000000),
    createdAt: DateTime.local(),
    authorName: 'Katrina Berkley',
    type: ActivityType.StatusChanged,
    content
  });
};

const UploadPage = () => {
  const { id } = useParams();
  const { state, updateProject } = useGlobalState();
  const project = state.projects[id];

  const [file, setFile] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>();
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(
    project.status
  );
  const [score, setScore] = useState('');

  const history = useHistory();

  useDocumentTitle(`EASi: Upload a document to ${project && project.name}`);

  if (!project) {
    return <main>Project not found</main>;
  }

  if (file !== '') {
    const projectStatuses = new Set<ProjectStatus>();
    projectStatuses.add(project.status);
    Object.values(ProjectStatus).forEach(status => {
      projectStatuses.add(status);
    });

    return (
      <main
        id="main-content"
        className="easi-main-content grid-container margin-bottom-5"
      >
        <h1>Upload a document to {project.name}</h1>
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
              className="usa-file-input__preview"
              aria-hidden="true"
              style={{ marginBottom: 0 }}
            >
              <img
                id="uploded-file"
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt={file}
                className="usa-file-input__preview-image usa-file-input__preview-image--generic"
              />
              {file}
            </div>
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
        <fieldset className="usa-fieldset margin-top-2">
          <legend className="text-bold margin-bottom-1">
            What type of document are you uploading?
          </legend>
          {Object.values(DocumentType).map(value => {
            const docType = value as DocumentType;
            const docTypeName = docType.toString();
            return (
              <>
                <div className="usa-radio">
                  <input
                    className="usa-radio__input"
                    id={`input-${docType}`}
                    type="radio"
                    name="document-type"
                    value={docType}
                    checked={documentType === docType}
                    onChange={() => {
                      setDocumentType(docType);
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor={`input-${docType}`}
                  >
                    {docType}
                  </label>
                </div>
                {docTypeName === 'Test Results' &&
                  documentType === DocumentType.TestResults && (
                    <div className="width-card-lg margin-top-neg-2 margin-left-4 margin-bottom-1">
                      <label className="usa-label" htmlFor="input-type-text">
                        Test score
                      </label>
                      <input
                        className="usa-input"
                        id="input-type-text"
                        name="input-type-text"
                        type="text"
                        value={score}
                        onChange={e => setScore(e.target.value)}
                      />
                    </div>
                  )}
              </>
            );
          })}
        </fieldset>
        <fieldset className="usa-fieldset margin-top-2">
          <legend className="text-bold margin-bottom-1">
            Do you need to change the project status?
          </legend>

          {Array.from(projectStatuses.values()).map(value => {
            const status = value as ProjectStatus;
            return (
              <>
                <div className="usa-radio">
                  <input
                    className="usa-radio__input"
                    id={`input-${status}`}
                    type="radio"
                    name="project-status"
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
                    {project.status === status &&
                      `No, don't change project status (leave as ${status})`}
                    {project.status !== status && status}
                  </label>
                </div>
                {project.status === status && (
                  <div
                    className="margin-bottom-1 text-center"
                    style={{ width: '1.6rem' }}
                  >
                    or
                  </div>
                )}
              </>
            );
          })}
        </fieldset>
        <p className="usa-prose">
          Changing the project status will send an email to all members of the
          TRB team letting them know about the new status.
        </p>
        <button
          type="submit"
          className="usa-button"
          disabled={!documentType}
          onClick={() => {
            if (documentType) {
              addDocument(project, documentType, score);
              if (projectStatus !== project.status) {
                addActivity(project, `Status changed to ${projectStatus}.`);
                project.status = projectStatus;
                updateProject(project);
              }
              history.push(`/TRB/projects/${project.id}`);
            }
          }}
        >
          Upload document
        </button>
        <Link to={`/TRB/projects/${id}`}>
          Don&rsquo;t upload and return to project page
        </Link>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="easi-main-content grid-container margin-bottom-5"
    >
      <h1>Upload a document to {project.name}</h1>

      <div className="usa-form-group">
        <label className="usa-label" htmlFor="file-input-single">
          Choose a document to upload
        </label>
        <div className="usa-prose">
          <p>
            This document can be a PDF or DOC and can be no larger than 5 MB.
          </p>
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
      <p>
        <Link to={`/TRB/projects/${id}`}>
          Don&rsquo;t upload and return to project page
        </Link>
      </p>
    </main>
  );
};

export default UploadPage;
