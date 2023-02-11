import { useMemo } from "react";
import { MetadataStepProps } from ".";
import { CircularProgress, Typography } from "@mui/material";
import useAutocompleteTags from "hooks/useAutocompleteTags";
import React from "react";

const useAddTagsSteps = (props: MetadataStepProps) => {
  const { stepTitle = "Add tags to the image", stepDescription } = props;

  const { Autocomplete, selectedTags, isLoadingTags } = useAutocompleteTags({
    label: "Search tags",
  });

  const title = useMemo(() => {
    return (
      <React.Fragment>
        <p>
          {stepTitle}
        </p>
        {
          stepDescription && (
            <Typography variant="body1" color="textSecondary">
              {stepDescription}
            </Typography>
          )
        }
      </React.Fragment>
    );
  }, [stepTitle]);

  const content = useMemo(() => {
    if (isLoadingTags) {
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