import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import BreadcrumbNav from 'components/BreadcrumbNav';

import projects from '../data';
import { Activity, DocumentType, ProjectStatus } from '../types';

const ProjectPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  //   const { path } = useRouteMatch();

  const project = projects.find(p => p.id.toString() === id);

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
                <tr>
                  <td>{document.createdAt.toLocaleString()}</td>
                  <td>
                    {document.type}{' '}
                    {document.type === DocumentType.TestResults && (
                      <span>- {document.score}%</span>
                    )}
                  </td>
                  <td>
                    <a href="#tk">
                      View <span className="usa-sr-only">{document.type}</span>
                    </a>
                  </td>
                  <td>
                    <a href="#tk">
                      Remove{' '}
                      <span className="usa-sr-only">{document.type}</span>
                    </a>
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
        {project.activities
          .sort((a, b) => b.createdAt.toSeconds() - a.createdAt.toSeconds())
          .map((activity: Activity) => {
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
    </main>
  );
};

export default ProjectPage;
