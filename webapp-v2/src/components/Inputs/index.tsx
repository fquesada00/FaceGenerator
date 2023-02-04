import { TextField } from "@mui/material"

type InputProps<T> = {
  label: string,
  value?: T,
  type?: string,
  required?: boolean,
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: boolean,
  helperText?: string
}

const Input = <T extends unknown>(props: InputProps<T>) => {
  const { label, value, onChange, type, required, inputProps, error, helperText } = props

  return (
    <TextField
      label={label}
      value={value}
      type={type}
      onChange={onChange}
      variant="outlined"
      required={required}
      inputProps={inputProps}
      error={error}
      helperText={helperText}
    />
  )
}

export default Input;