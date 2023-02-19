import clsx from 'clsx';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import IdInput from '../IdInput';

type CustomIdInputProps = {
  setId: (n: number) => void;
  setErrorMessage: (s: string) => void;
  errorMessage: string;
  required?: boolean;
  label?: string;
  id: number;
};

function CustomIdInput(props: CustomIdInputProps) {
  const { setId, setErrorMessage, errorMessage, required, label, id } = props;

  return (
    <div className={clsx(inputsClasses.field)}>
      <IdInput
        value={id}
        onChange={n => {
          if (isNaN(n)) {
            setId(0);
            return;
          }

          setId(n);
        }}
        label={label}
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
        required={required}
      />
    </div>
  );
}

export default CustomIdInput;
