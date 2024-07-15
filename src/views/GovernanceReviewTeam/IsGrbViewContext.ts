import { createContext } from 'react';

/**
 * Context for rendering GRB reviewer views
 *
 * Set to `true` if user is GRB reviewer and does not have GOVTEAM job code
 */
const IsGrbViewContext = createContext<boolean>(false);

export default IsGrbViewContext;
