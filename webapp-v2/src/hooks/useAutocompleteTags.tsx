import useAutocompleteChipsInput from "components/Inputs/useAutocompleteChipsInput";
import { toastError } from "components/Toast";
import { useEffect } from "react";
import { useMutation } from "react-query";
import ApiError from "services/api/Error";
import { getAllTags } from "services/api/FaceGeneratorApi";

type AutocompleteTags = {
  label?: string;
  allowUserInput?: boolean;
};

const useAutocompleteTags = (props: AutocompleteTags) => {
  const { label = 'Tags', allowUserInput } = props;

  const {
    mutate: mutateGetAllTags,
    isLoading: isLoadingTags,
    data: tags
  } = useMutation(getAllTags, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { content: Autocomplete, value: selectedTags } = useAutocompleteChipsInput({
    options: tags,
    value: [],
    label: label,
    allowUserInput: allowUserInput
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