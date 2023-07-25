import { TextField } from '@mui/material';
import { useField, FieldHookConfig } from 'formik';

type FormikTextInputProps = {
  label: string;
  required: boolean;
  endAdornment?: React.ReactNode;
} & FieldHookConfig<any>;

function FormikTextInput(props: FormikTextInputProps) {
  const [field, meta] = useField(props);

  const { label, required = false, endAdornment } = props;

  return (
    <TextField
      {...field}
      fullWidth
      label={label}
      type='string'
      value={field.value}
      onChange={e => {
        if (e.target.value === '') return; // Ignore 'e', '+', '-', etc.
        field.onChange(e);
      }}
      onBlur={field.onBlur}
      required={required}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      InputProps={{
        endAdornment
      }}
    />
  );
}

export default FormikTextInput;
