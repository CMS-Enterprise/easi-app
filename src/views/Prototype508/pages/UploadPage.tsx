import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import projects from '../data';
import { ActivityType, DocumentType, Project } from '../types';

const addDocument = (project: Project, type: DocumentType, score: string) => {
  project.documents.push({
    mimetype: 'application/pdf',
    createdAt: DateTime.local(),
    type,
    score: parseInt(score, 10)
  });
  project.activities.push({
    id: Math.round(Math.random() * 10000000),
    content: `${type} uploaded - ${score}%`,
    createdAt: DateTime.local(),
    authorName: 'Aaron Allen',
    type: ActivityType.DocumentAdded
  });
  project.banner = `${type} uploaded to ${project.name} project page.`; // eslint-disable-line no-param-reassign
};

const UploadPage = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id.toString() === id);

  const [file, setFile] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>();
  const [score, setScore] = useState('');

  const history = useHistory();

  if (!project) {
    return <main>Project not found</main>;
  }

  if (file !== '') {
    return (
      <main>
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
        <fieldset className="usa-fieldset">
          <legend className="usa-legend usa-legend">
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

        <button
          type="submit"
          className="usa-button"
          disabled={!documentType}
          onClick={() => {
            if (documentType) {
              addDocument(project, documentType, score);
              history.push(`/508/projects/${project.id}`);
            }
          }}
        >
          Upload document
        </button>
        <Link to={`/508/projects/${id}`}>
          Don&rsquo;t upload and return to project page
        </Link>
      </main>
    );
  }

  return (
    <main>
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
    </main>
  );
};

export default UploadPage;
