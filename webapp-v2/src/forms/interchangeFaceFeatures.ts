import * as Yup from 'yup';

export interface InterchangeFaceFeaturesFormValues {
  firstId: number;
  secondId: number;
}

export const initialValues: InterchangeFaceFeaturesFormValues = {
  firstId: 0,
  secondId: 0
};

export const interchangeFaceFeaturesSchema = Yup.object().shape({
  firstId: Yup.number()
    .required('First ID is required')
    .min(1, 'First ID must be greater than 0'),
  secondId: Yup.number()
    .required('Second ID is required')
    .min(1, 'Second ID must be greater than 0')
});
