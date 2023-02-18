import useAutocompleteChipsInput from 'components/Inputs/useAutocompleteChipsInput';
import { toastError } from 'components/Toast';
import { useQuery } from 'react-query';
import ApiError from 'services/api/Error';
import useFacesApi from './api/useFacesApi';

type AutocompleteTags = {
  label?: string;
  allowUserInput?: boolean;
};

const useAutocompleteTags = (props: AutocompleteTags) => {
  const { getAllTags } = useFacesApi();
  const { label = 'Tags', allowUserInput } = props;

  const { isLoading: isLoadingTags, data: tags } = useQuery(
    'tags',
    getAllTags,
    {
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error.toString());
        }
      }
    }
  );

  const { content: Autocomplete, value: selectedTags } =
    useAutocompleteChipsInput({
      options: tags,
      value: [],
      label: label,
      allowUserInput: allowUserInput
    });

  return {
    Autocomplete,
    selectedTags,
    isLoadingTags
  };
};

export default useAutocompleteTags;
