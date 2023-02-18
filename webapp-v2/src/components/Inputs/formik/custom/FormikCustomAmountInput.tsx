import clsx from 'clsx';
import { useField } from 'formik';
import { MIN_FACES, MAX_FACES } from 'constants';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import FormikAmountInput from '../FormikAmountInput';

type FormikCustomAmountInputProps = {
  name: string;
};

function FormikCustomAmountInput(props: FormikCustomAmountInputProps) {
  const { name } = props;

  return (
    <div className={clsx(inputsClasses.field)}>
      <FormikAmountInput min={MIN_FACES} max={MAX_FACES} name={name} />
    </div>
  );
}

export default FormikCustomAmountInput;
