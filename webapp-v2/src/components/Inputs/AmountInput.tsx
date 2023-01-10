import { useEffect, useState } from "react";
import NumericInput from "./NumericInput"

type AmountInputProps = {
  onChange: (n: number) => void,
  min: number,
  max: number,
  setErrorMessage: (s: string) => void,
  errorMessage?: string,
}

const AmountInput = (props: AmountInputProps) => {
  const { onChange, min, max, setErrorMessage, errorMessage } = props;

  const [errorText, setErrorText] = useState<string>("");

  useEffect(() => {
    if (errorMessage) {
      setErrorText(errorMessage);
    }
  }, [errorMessage]);

  return (
    <NumericInput
      label="Amount"
      onChange={(n) => {
        if (n < min || n > max) {
          const errorMessage = `Must be between ${min} and ${max}`;
          setErrorText(errorMessage);
          setErrorMessage(errorMessage);
          onChange(n);
          return;
        }

        if (errorText !== "") {
          setErrorText("");
          setErrorMessage("");
        }

        onChange(n);
      }}
      required
      error={errorText !== ""}
      helperText={errorText}
      min={min}
      max={max}
    />
  );
}

export default AmountInput;