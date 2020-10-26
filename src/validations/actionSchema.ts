import * as Yup from 'yup';

const actionSchema = Yup.object().shape({
  feedback: Yup.string().required('Please fill out email')
});

export default actionSchema;
