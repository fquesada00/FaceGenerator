import * as Yup from 'yup';
import { MAX_FACES, MIN_FACES } from 'constants/constants';
import { minMaxField } from './commons';

export interface RandomFacesFormValues {
  randomFaces: number,
  referenceFace?: File
}

export const initialValues: RandomFacesFormValues = {
  randomFaces: 0,
  referenceFace: undefined
};

export const randomFacesFormSchema = Yup.object().shape({
  randomFaces: minMaxField(MIN_FACES, MAX_FACES),
  referenceFace: Yup.mixed().notRequired()
    .test(
      'fileSize',
      'File size must be less than 5MB',
      value => !value || value.size <= 5000000
    )
});
