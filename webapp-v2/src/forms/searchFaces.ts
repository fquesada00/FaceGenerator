import * as Yup from 'yup';

export interface SearchFacesValues {
  tags: string[];
}

export const initialValues: SearchFacesValues = {
  tags: []
};

export const searchFacesFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(Yup.string().matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters'))
    .min(1, 'At least one tag is required')
});
