import { TextField } from '@mui/material';

type NumericInputProps = {
  label: string;
  required?: boolean;
  onChange: (n: number) => void;
  error?: boolean;
  helperText?: string;
  min?: number;
  max?: number;
  value?: number;
};

function NumericInput(props: NumericInputProps) {
  const { label, onChange, required, error, helperText, min, max, value } =
    props;

  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={!value ? '' : value}
      onChange={e => {
        const newValue = parseInt(e.target.value);
        if (isNaN(newValue)) {
          onChange(newValue);
          return;
        }

        onChange(newValue);
      }}
      required={required}
      error={error}
      helperText={helperText}
      inputProps={{
        min,
        max
      }}
    />
  );
}

export default NumericInput;
