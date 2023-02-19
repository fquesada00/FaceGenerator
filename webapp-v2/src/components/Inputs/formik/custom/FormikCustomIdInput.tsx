import clsx from 'clsx';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import FormikIdInput from '../FormikIdInput';

type FormikCustomIdInputProps = {
  name: string;
  required?: boolean;
  label?: string;
};

function FormikCustomIdInput(props: FormikCustomIdInputProps) {
  const { required, label, name } = props;

  return (
    <div className={clsx(inputsClasses.field)}>
      <FormikIdInput label={label} name={name} required={required} />
    </div>
  );
}

export default FormikCustomIdInput;
