import { TextField } from "@mui/material";
import { useState } from "react";

type NumericInputProps = {
  label: string,
  required?: boolean,
  onChange: (n: number) => void,
  error?: boolean,
  helperText?: string,
  min?: number,
  max?: number,
}

const NumericInput = (props: NumericInputProps) => {
  const { label, onChange, required, error, helperText, min, max } = props;

  const [value, setValue] = useState<number>(-1);
  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={value === -1 ? "" : value}
      onChange={(e) => {
        const newValue = parseInt(e.target.value);
        if (isNaN(newValue)) {
          setValue(-1);
          onChange(newValue);
          return;
        }

        setValue(newValue);
        onChange(newValue);
      }}
      required={required}
      error={error}
      helperText={helperText}
      inputProps={{
        min: min,
        max: max,
      }}
    />
  );

}

export default NumericInput;