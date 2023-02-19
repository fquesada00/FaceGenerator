import * as Yup from 'yup';

export interface TransitionFacesFormValues {
  firstId: number;
  secondId: number;
  amount: number;
}

export const initialValues: TransitionFacesFormValues = {
  firstId: 0,
  secondId: 0,
  amount: 0
};

export const transitionFacesSchema = Yup.object().shape({
  firstId: Yup.number()
    .required('First ID is required')
    .min(1, 'First ID must be greater than 0'),
  secondId: Yup.number()
    .required('Second ID is required')
    .min(1, 'Second ID must be greater than 0'),
  amount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than 0')
    .max(5, 'Amount must be less than 5')
});
