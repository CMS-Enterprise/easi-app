import * as yup from 'yup';

import { TeamMemberFields } from 'views/SystemProfile/components/Team/Edit/TeamMemberForm';

const teamMemberSchema: yup.SchemaOf<TeamMemberFields> = yup.object({
  euaUserId: yup.string().required(),
  desiredRoleTypeIDs: yup.array(yup.string().required()).min(1)
});

export default teamMemberSchema;
