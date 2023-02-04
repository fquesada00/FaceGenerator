import { useMemo, useState } from "react";
import { MetadataStepProps } from ".";

const useAddTagsSteps = (props: MetadataStepProps) => {
  const [tags, setTags] = useState<string[]>([]);

  const title = useMemo(() => {
    return (
      <p>
        Add tags to the image
      </p>
    );
  }, []);

  const content = useMemo(() => {
    return (
      <p>
        Add tags to the image
      </p>
    );
  }, []);

  return {
    title,
    content,
  };
};

export default useAddTagsSteps;