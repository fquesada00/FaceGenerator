import clsx from "clsx";
import { MIN_FACES, MAX_FACES } from "components/utils";
import AmountInput from "../AmountInput";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";

type CustomAmountInputProps = {
  setAmount: (n: number) => void,
  setErrorMessage: (s: string) => void,
  errorMessage: string,
  amount: number,
}

const CustomAmountInput = (props: CustomAmountInputProps) => {
  const { setAmount, setErrorMessage, errorMessage, amount } = props;

  return (
    <div className={clsx(inputsClasses.field)}>
      <AmountInput
        value={amount}
        onChange={(n) => {
          if (isNaN(n)) {
            setAmount(0);
            return;
          }

          setAmount(n);
        }}
        min={MIN_FACES} max={MAX_FACES} setErrorMessage={setErrorMessage} errorMessage={errorMessage}
      />
    </div>
  );
}

export default CustomAmountInput;