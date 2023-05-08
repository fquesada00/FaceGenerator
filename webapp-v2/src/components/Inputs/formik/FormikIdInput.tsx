import FormikTextInput from './FormikTextInput';

type FormikIdInputProps = {
  name: string;
  required?: boolean;
  label?: string;
  endAdornment?: React.ReactNode;
};

function FormikIdInput(props: FormikIdInputProps) {
  const { name, required = false, label, endAdornment } = props;

  return (
    <FormikTextInput
      name={name}
      label={label ?? 'ID'}
      required={required}
      endAdornment={endAdornment}
    />
  );
}

export default FormikIdInput;
