import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon
} from '@mui/icons-material';
import { useState, useMemo } from "react";
import { Checkbox, TextField, Autocomplete, Chip } from "@mui/material";

type AutocompleteChipsInputProps = {
  options: string[] | undefined;
  value: string[];
  onChange?: (value: string[]) => void;
  label: string;
};

const useAutocompleteChipsInput = (props: AutocompleteChipsInputProps) => {
  const { options, value, onChange, label } = props;

  const [selectedTags, setSelectedTags] = useState<string[]>(value);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    setSelectedTags(newValue);
    onChange?.(newValue);
  };

  const MemoizedAutocomplete = useMemo(() => {
    return (
      <Autocomplete
        multiple
        options={options ?? []}
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
            placeholder={label}
          />
        )}
        value={selectedTags}
        onChange={handleChange}
      />
    );
  }, [selectedTags, options, label]);

  return {
    content: MemoizedAutocomplete,
    value: selectedTags
  };
};

export default useAutocompleteChipsInput;