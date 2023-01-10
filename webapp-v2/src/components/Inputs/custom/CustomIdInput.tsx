import clsx from "clsx";
import IdInput from "../IdInput";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";

type CustomIdInputProps = {
  setId: (n: number) => void,
  setErrorMessage: (s: string) => void,
  errorMessage: string,
  required?: boolean,
  label?: string,
}

const CustomIdInput = (props: CustomIdInputProps) => {
  const { setId, setErrorMessage, errorMessage, required, label} = props;
  
  return (
    <div className={clsx(inputsClasses.field)}>
      <IdInput
        onChange={(n) => {
          if (isNaN(n)) {
            setId(0);
            return;
          }

          setId(n);
        }}
        label={label}
        setErrorMessage={setErrorMessage} errorMessage={errorMessage} required={required}
      />
    </div>
  );
}

export default CustomIdInput;