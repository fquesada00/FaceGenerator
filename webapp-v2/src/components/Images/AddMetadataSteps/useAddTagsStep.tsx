import { useMemo } from 'react';
import { MetadataStepProps } from '.';
import { Typography } from '@mui/material';
import useAutocompleteTags from 'hooks/useAutocompleteTags';
import React from 'react';
import CenteredCircularLoader from 'components/Loaders/CenteredCircularLoader';

const useAddTagsSteps = (props: MetadataStepProps) => {
  const { stepTitle = 'Add tags to the image', stepDescription } = props;

  const { Autocomplete, selectedTags, isLoadingTags } = useAutocompleteTags({
    label: 'Search tags',
    removeEmptyTag: true
  });

  const title = useMemo(() => {
    return (
      <React.Fragment>
        <p>{stepTitle}</p>
        {stepDescription && (
          <Typography variant='body1' color='textSecondary'>
            {stepDescription}
          </Typography>
        )}
      </React.Fragment>
    );
  }, [stepTitle]);

  const content = useMemo(() => {
    if (isLoadingTags) {
      return <CenteredCircularLoader className='w-full h-20' />;
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
