import * as Yup from 'yup';
import { MAX_FACES, MIN_FACES } from 'constants/constants';
import { minMaxField } from './commons';

export interface RandomFacesFormValues {
  randomFaces: number;
}

export const initialValues: RandomFacesFormValues = {
  randomFaces: 0
};

export const randomFacesFormSchema = Yup.object().shape({
  randomFaces: minMaxField(MIN_FACES, MAX_FACES)
});
