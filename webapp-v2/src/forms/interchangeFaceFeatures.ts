import * as Yup from 'yup';

export interface InterchangeFaceFeaturesFormValues {
  firstId: string;
  secondId: string;
}

export const initialValues: InterchangeFaceFeaturesFormValues = {
  firstId: '0',
  secondId: '0'
};

export const interchangeFaceFeaturesSchema = Yup.object().shape({
  firstId: Yup.string().required('First ID is required'),
  secondId: Yup.string().required('Second ID is required')
});
