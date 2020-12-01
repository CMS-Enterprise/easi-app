import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@trussworks/react-uswds';

import projects from '../data';
import { ProjectStatus } from '../types';

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

export default ProjectsPage;
