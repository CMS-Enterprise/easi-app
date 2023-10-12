import * as yup from 'yup';

const dateRangeSchema = yup.object().shape({
  dateStart: yup.date().required(),
  dateEnd: yup.date().required()
});

export default dateRangeSchema;
