import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import { ProgressStatus } from '../components/Progress';
import RequestStatusField from '../components/RequestStatusField';
import useDocumentTitle from '../hooks/DocumentTitle';
import { useGlobalState } from '../state';
import { DocumentType, Project, RequestStep } from '../types';

const addDocument = ({
  project,
  type,
  score,
  otherName
}: {
  project: Project;
  type: DocumentType;
  score: string;
  otherName: string;
}) => {
  project.documents.push({
    id: Math.round(Math.random() * 10000000),
    mimetype: 'application/pdf',
    createdAt: DateTime.local(),
    score: parseInt(score, 10),
    type,
    otherName
  });
  project.banner = `${type} uploaded to ${project.name} project page.`; // eslint-disable-line no-param-reassign
};

const UploadPage = () => {
  const { id } = useParams();
  const { state, updateProject } = useGlobalState();
  const project = state.projects[id];

  const [file, setFile] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>();
  const [projectStatus, setProjectStatus] = useState<RequestStep>(
    project.status
  );
  const [score, setScore] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [date, setDate] = useState<DateTime>();

  const history = useHistory();

  useDocumentTitle(`EASi: Upload a document to ${project && project.name}`);

  if (!project) {
    return <main>Project not found</main>;
  }

  if (file !== '') {
    const projectStatuses = new Set<RequestStep>();
    projectStatuses.add(project.status);
    Object.values(RequestStep).forEach(status => {
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
                {docTypeName === DocumentType.TestResults &&
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
                {docTypeName === DocumentType.Other &&
                  documentType === DocumentType.Other && (
                    <div className="width-card-lg margin-top-neg-2 margin-left-4 margin-bottom-1">
                      <label className="usa-label" htmlFor="input-type-text">
                        Document name
                      </label>
                      <input
                        className="usa-input"
                        id="input-type-text"
                        name="input-type-text"
                        type="text"
                        value={documentName}
                        onChange={e => setDocumentName(e.target.value)}
                      />
                    </div>
                  )}
              </>
            );
          })}
        </fieldset>

        <RequestStatusField
          projectStatus={projectStatus}
          projectName={project.name}
          setProjectStatus={setProjectStatus}
          setDate={setDate}
        />

        <p className="usa-prose">
          Changing the project status will send an email to all members of the
          508 team letting them know about the new status.
        </p>
        <button
          type="submit"
          className="usa-button"
          disabled={!documentType}
          onClick={() => {
            if (documentType) {
              addDocument({
                project,
                type: documentType,
                score,
                otherName: documentName
              });
              if (projectStatus !== project.status) {
                project.status = projectStatus;
                project.lastUpdatedAt = DateTime.local();
                Object.entries(project.stepStatuses).forEach(
                  ([requestStep, stepStatus]) => {
                    if (!stepStatus) {
                      return;
                    }
                    if (requestStep === projectStatus) {
                      // eslint-disable-next-line no-param-reassign
                      stepStatus.date = date;
                      // eslint-disable-next-line no-param-reassign
                      stepStatus.status = ProgressStatus.Current;
                    } else {
                      // eslint-disable-next-line no-param-reassign
                      stepStatus.status = ProgressStatus.Completed;
                    }
                  }
                );

                if (!project.stepStatuses[projectStatus]) {
                  // eslint-disable-next-line no-param-reassign
                  project.stepStatuses[projectStatus] = {
                    status: ProgressStatus.Current,
                    date
                  };
                }
              }
              updateProject(project);
              history.push(`/508/v2/requests/${project.id}`);
            }
          }}
        >
          Upload document
        </button>
        <Link to={`/508/v2/requests/${project.id}`}>
          Don&rsquo;t upload and return to request page
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
        <Link to={`/508/v2/requests/${id}`}>
          Don&rsquo;t upload and return to request page
        </Link>
      </p>
    </main>
  );
};

export default UploadPage;
