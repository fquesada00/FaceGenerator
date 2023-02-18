import * as Yup from 'yup';

export const minMaxField = (min: number, max: number) =>
  Yup.number()
    .min(min, `Must be between ${min} and ${max}`)
    .max(max, `Must be between ${min} and ${max}`)
    .required();
