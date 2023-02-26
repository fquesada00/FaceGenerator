import * as Yup from 'yup';

export interface TransitionFacesFormValues {
  firstId: string;
  secondId: string;
  amount: number;
}

export const initialValues: TransitionFacesFormValues = {
  firstId: '0',
  secondId: '0',
  amount: 0
};

export const transitionFacesSchema = Yup.object().shape({
  firstId: Yup.string().required('First ID is required'),
  secondId: Yup.string().required('Second ID is required'),
  amount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than 0')
    .max(5, 'Amount must be less than 5')
});
