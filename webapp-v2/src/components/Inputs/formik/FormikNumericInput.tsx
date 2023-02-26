import { TextField } from '@mui/material';
import { useField, FieldProps, FieldHookConfig } from 'formik';

type FormikNumericInputProps = {
  label: string;
  required: boolean;
  min?: number;
  max?: number;
} & FieldHookConfig<any>;

function FormikNumericInput(props: FormikNumericInputProps) {
  const [field, meta] = useField(props);

  const { label, required = false, min, max } = props;

  return (
    <TextField
      {...field}
      fullWidth
      label={label}
      type='number'
      value={field.value}
      onChange={e => {
        if (e.target.value === '') return; // Ignore 'e', '+', '-', etc.
        field.onChange(e);
      }}
      onBlur={field.onBlur}
      required={required}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      inputProps={{
        min,
        max
      }}
    />
  );
}

export default FormikNumericInput;
