import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon
} from '@mui/icons-material';
import { Checkbox, TextField, Autocomplete, Chip } from '@mui/material';
import { toastError } from 'components/Toast';
import { useField } from 'formik';
import useFacesApi from 'hooks/api/useFacesApi';
import { useQuery } from 'react-query';
import ApiError from 'services/api/Error';

interface FormikAutoCompleteTagsProps {
  name: string;
  label?: string;
  allowUserInput?: boolean;
}

function FormikAutoCompleteTags(props: FormikAutoCompleteTagsProps) {
  const { getAllTags } = useFacesApi();
  const { allowUserInput = false, name, label = '' } = props;
  const { isLoading: _, data: tags } = useQuery('tags', getAllTags, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const [field, meta, helpers] = useField(name);

  return (
    <Autocomplete
      {...field}
      onOpen={() => helpers.setTouched(true)}
      multiple
      options={tags ?? []}
      freeSolo={allowUserInput}
      disableCloseOnSelect
      includeInputInList
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
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={label}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error}
        />
      )}
      onChange={(_, value) => {
        helpers.setValue(value);
      }}
    />
  );
}

export default FormikAutoCompleteTags;
