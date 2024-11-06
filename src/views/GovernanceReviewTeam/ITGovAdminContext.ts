import { createContext } from 'react';

/**
 * Context for rendering GRB reviewer views
 *
 * Set to `true` if user has GOVTEAM job code
 */
const ITGovAdminContext = createContext<boolean>(false);

export default ITGovAdminContext;
