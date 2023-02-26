import FormikNumericInput from './FormikNumericInput';

type FormikAmountInputProps = {
  name: string;
  min: number;
  max: number;
};

function FormikAmountInput(props: FormikAmountInputProps) {
  const { min, max, name } = props;

  return (
    <FormikNumericInput
      name={name}
      label='Amount'
      required
      min={min}
      max={max}
    />
  );
}

export default FormikAmountInput;
