import { useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import useAutocompleteTags from 'hooks/useAutocompleteTags';
import { MetadataStepProps } from '.';

const useAddTagsSteps = (props: MetadataStepProps) => {
  const { Autocomplete, selectedTags, isLoadingTags } = useAutocompleteTags({
    label: 'Search tags'
  });

  const title = useMemo(() => <p>Add tags to the image</p>, []);

  const content = useMemo(() => {
    if (isLoadingTags) {
      return (
        <div
          className="justify-center items-center flex w-full"
          style={{ height: '5rem' }}
        >
          <CircularProgress />
        </div>
      );
    }

    return <div>{Autocomplete}</div>;
  }, [Autocomplete, isLoadingTags]);

  return {
    title,
    content,
    data: {
      tags: selectedTags
    }
  };
};

export default useAddTagsSteps;
