import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon
} from '@mui/icons-material';
import { useMemo, useState } from "react";
import { MetadataStepProps } from ".";
import { Checkbox, TextField, Autocomplete, Chip, CircularProgress } from "@mui/material";
import { useQuery } from 'react-query';
import { getAllTags } from 'services/api/FaceGeneratorApi';
import { toastError } from 'components/Toast';
import ApiError from 'services/api/Error';

const useAddTagsSteps = (props: MetadataStepProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { isLoading: loadingTags, data: tags } = useQuery('tags', getAllTags, {
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const title = useMemo(() => {
    return (
      <p>
        Add tags to the image
      </p>
    );
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    setSelectedTags(newValue);
  };

  const content = useMemo(() => {
    if (loadingTags) {
      return (
        <div className="justify-center items-center flex w-full" style={{ height: "5rem" }}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <Autocomplete
        multiple
        options={tags ?? []}
        freeSolo
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="filled" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Tags"
          />
        )}
        value={selectedTags}
        onChange={handleChange}
      />
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