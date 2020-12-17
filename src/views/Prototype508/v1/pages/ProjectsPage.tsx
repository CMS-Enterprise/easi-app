import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@trussworks/react-uswds';

import useDocumentTitle from '../hooks/DocumentTitle';
import { useGlobalState } from '../state';

const ProjectsPage = () => {
  const { state } = useGlobalState();

  useDocumentTitle(`EASi: Active 508 projects`);

  return (
    <main
      id="main-content"
      className="easi-main-content grid-container margin-bottom-5"
    >
      <h1>Active 508 Projects</h1>
      <Table bordered={false} fullWidth>
        <caption className="usa-sr-only">
          List of active five oh eight projects
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Project Name
            </th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Submission Date
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
          {Object.entries(state.projects).map(([id, project]) => {
            return (
              <tr key={id}>
                <th scope="row">
                  <Link to={`/508/v1/projects/${id}`}>{project.name}</Link>
                </th>
                <td>{project.submissionDate.toFormat('LLLL d y')}</td>
                <td>{project.businessOwner.name}</td>
                <td>
                  <strong>{project.status}</strong>
                  <br />
                  {`last updated on ${project.lastUpdatedAt.toFormat(
                    'LLLL d y'
                  )}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </main>
  );
};

export default ProjectsPage;
