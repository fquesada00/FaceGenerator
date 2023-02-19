import { FormikAutoCompleteTagsProps } from 'components/Inputs/formik/models/FormikAutoCompleteTagsModels';
import useAutocompleteChipsInput from 'components/Inputs/useAutocompleteChipsInput';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { toastError } from 'components/Toast';
import ApiError from 'services/api/Error';
import useFacesApi from './api/useFacesApi';

type AutocompleteTags = {
  label?: string;
  allowUserInput?: boolean;
  formikAutoCompleteTagsProps?: FormikAutoCompleteTagsProps;
};

const useAutocompleteTags = (props: AutocompleteTags) => {
  const { label = 'Tags', allowUserInput, formikAutoCompleteTagsProps } = props;
  const { getAllTags } = useFacesApi();

  const {
    mutate: mutateGetAllTags,
    isLoading: isLoadingTags,
    data: tags
  } = useMutation(getAllTags, {
    onSuccess: data => {
      console.log(data);
    },
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { content: Autocomplete, value: selectedTags } =
    useAutocompleteChipsInput({
      options: tags,
      value: [],
      label: label,
      allowUserInput: allowUserInput,
      formikAutoCompleteTagsProps
    });

  useEffect(() => {
    mutateGetAllTags();
  }, []);

  return {
    Autocomplete,
    selectedTags,
    isLoadingTags
  };
};

export default useAutocompleteTags;
