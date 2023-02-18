import { useEffect, useState } from 'react';
import NumericInput from './NumericInput';

type IdInputProps = {
  onChange: (n: number) => void;
  setErrorMessage: (s: string) => void;
  errorMessage?: string;
  required?: boolean;
  label?: string;
  value?: number;
};

function IdInput(props: IdInputProps) {
  const { onChange, setErrorMessage, errorMessage, required, label, value } =
    props;

  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    setErrorText(errorMessage ?? '');
  }, [errorMessage]);

  return (
    <NumericInput
      label={label ?? 'ID'}
      value={value === 0 ? undefined : value}
      onChange={n => {
        if (n < 1) {
          const errorMessage = `Must be greater than 0`;
          setErrorText(errorMessage);
          setErrorMessage(errorMessage);
          onChange(n);
          return;
        }

        if (errorText !== '') {
          setErrorText('');
          setErrorMessage('');
        }

        onChange(n);
      }}
      required={required}
      error={errorText !== ''}
      helperText={errorText}
    />
  );
}

export default IdInput;
