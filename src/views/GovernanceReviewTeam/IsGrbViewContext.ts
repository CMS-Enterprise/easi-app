import { createContext } from 'react';

/**
 * Context for rendering GRB reviewer views
 *
 * Set to `true` if user is GRB reviewer and not GRT admin
 */
const IsGrbViewContext = createContext<boolean>(false);

export default IsGrbViewContext;
