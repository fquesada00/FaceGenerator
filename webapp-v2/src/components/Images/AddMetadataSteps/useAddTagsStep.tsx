import { useMemo } from "react";
import { MetadataStepProps } from ".";
import { CircularProgress } from "@mui/material";
import { useQuery } from 'react-query';
import { getAllTags } from 'services/api/FaceGeneratorApi';
import { toastError } from 'components/Toast';
import ApiError from 'services/api/Error';
import useAutocompleteChipsInput from 'components/Inputs/useAutocompleteChipsInput';

const useAddTagsSteps = (props: MetadataStepProps) => {
  const { isLoading: loadingTags, data: tags } = useQuery('tags', getAllTags, {
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { content: Autocomplete, value: selectedTags } = useAutocompleteChipsInput({
    options: tags,
    value: [],
    label: "Tags",
    allowUserInput: false
  });

  const title = useMemo(() => {
    return (
      <p>
        Add tags to the image
      </p>
    );
  }, []);

  const content = useMemo(() => {
    if (loadingTags) {
      return (
        <div className="justify-center items-center flex w-full" style={{ height: "5rem" }}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        {Autocomplete}
      </div>
    );
  }, [selectedTags, tags, loadingTags]);

  return {
    title,
    content,
    data: {
      tags: selectedTags
    }
  };
};

export default useAddTagsSteps;