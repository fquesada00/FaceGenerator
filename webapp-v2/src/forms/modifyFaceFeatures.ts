import { MAX_AGE, MIN_AGE } from 'constants/constants';
import * as Yup from 'yup';

export interface ModifyFaceFeaturesFormValues {
  id: string;
  age: number;
  gender: number;
  faceOrientationVertical: number;
  faceOrientationHorizontal: number;
  eyeDistance: number;
  eyebrowsDistance: number;
  eyesRatio: number;
  eyesOpen: number;
  eyesRoll: number;
  mouthLipRatio: number;
  mouthOpen: number;
  mouthRatio: number;
  mouthSmile: number;
  noseDistance: number;
  noseRatio: number;
  noseTip: number;
}

export const initialValues: ModifyFaceFeaturesFormValues = {
  id: '0',
  age: 0,
  gender: 0,
  faceOrientationVertical: 0,
  faceOrientationHorizontal: 0,
  eyeDistance: 0,
  eyebrowsDistance: 0,
  eyesRatio: 0,
  eyesOpen: 0,
  eyesRoll: 0,
  mouthLipRatio: 0,
  mouthOpen: 0,
  mouthRatio: 0,
  mouthSmile: 0,
  noseDistance: 0,
  noseRatio: 0,
  noseTip: 0
};

export const modifyFaceFeaturesSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
  age: Yup.number()
    .min(-MAX_AGE, `Age must be greater than or equal to ${MIN_AGE}`)
    .max(MAX_AGE, `Age must be less than or equal to ${MAX_AGE}`),
  gender: Yup.number().min(-1).max(1),
  faceOrientationVertical: Yup.number().min(-1).max(1),
  faceOrientationHorizontal: Yup.number().min(-1).max(1),
  eyeDistance: Yup.number().min(-1).max(1),
  eyebrowsDistance: Yup.number().min(-1).max(1),
  eyesRatio: Yup.number().min(-1).max(1),
  eyesOpen: Yup.number().min(-1).max(1),
  eyesRoll: Yup.number().min(-1).max(1),
  mouthLipRatio: Yup.number().min(-1).max(1),
  mouthOpen: Yup.number().min(-1).max(1),
  mouthRatio: Yup.number().min(-1).max(1),
  mouthSmile: Yup.number().min(-1).max(1),
  noseDistance: Yup.number().min(-1).max(1),
  noseRatio: Yup.number().min(-1).max(1),
  noseTip: Yup.number().min(-1).max(1)
});
