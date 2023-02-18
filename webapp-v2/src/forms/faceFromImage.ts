import * as Yup from 'yup';

export interface FaceFromImageFormValues {
  image: File | null;
}

export const initialValues: FaceFromImageFormValues = {
  image: null
};

export const faceFromImageFormSchema = Yup.object().shape({
  image: Yup.mixed()
    .required('Image is required')
    .test(
      'fileSize',
      'File size must be less than 5MB',
      value => value && value.size <= 5000000
    )
});
