import FormikTextInput from './FormikTextInput';

type FormikIdInputProps = {
  name: string;
  required?: boolean;
  label?: string;
};

function FormikIdInput(props: FormikIdInputProps) {
  const { name, required = false, label } = props;

  return (
    <FormikTextInput name={name} label={label ?? 'ID'} required={required} />
  );
}

export default FormikIdInput;
