import * as yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const basicSchema = yup.object({
  requestName: yup.string().required(),
  requestComponent: yup.string().required(),
  whatTechnicalAssistance: yup.string().required(),
  doHaveSolution: yup.boolean().nullable().default(null).required(),
  describeSolution: yup
    .string()
    .when('doHaveSolution', { is: true, then: schema => schema.required() }),
  whereInProcess: yup.string().required(),
  solutionDate: yup.boolean().nullable().default(null).required(),
  expectedStartDate: yup
    .string()
    .when('solutionDate', { is: true, then: schema => schema.required() }),
  expectedLiveDate: yup
    .string()
    .when('solutionDate', { is: true, then: schema => schema.required() })
  // selectOitGroups: yup.array().of(yup.string().required()).required()
});
