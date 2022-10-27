import { UUID } from './graphql_scalars';
import { PersonRole } from './graphql-global-types';

export interface TRBRequestAttendee {
  id: UUID | null;
  euaUserId: string;
  trbRequestId: UUID;
  component: string;
  role: PersonRole;
  createdAt: string;
}
