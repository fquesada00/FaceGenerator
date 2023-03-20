import NumericInput from 'components/Inputs/NumericInput';
import { useState, useMemo } from 'react';
import { MIN_AGE, MAX_AGE } from 'constants/constants';

const useAgeInput = () => {
  const [age, setAge] = useState(0);

  const [errorText, setErrorText] = useState<string>('');

  const AgeInput = useMemo(
    () => (
      <div className='w-48'>
        <NumericInput
          label='Age'
          value={age === 0 ? undefined : age}
          onChange={n => {
            if (n < MIN_AGE || n > MAX_AGE) {
              const errorMessage = `Must be between ${MIN_AGE} and ${MAX_AGE}`;
              setErrorText(errorMessage);
              setAge(n);
              return;
            }

            if (errorText !== '') {
              setErrorText('');
            }

            setAge(n);
          }}
          error={errorText !== ''}
          helperText={errorText}
          min={MIN_AGE}
          max={MAX_AGE}
        />
      </div>
    ),
    [age, errorText, setAge, setErrorText]
  );

  return {
    AgeInput,
    age
  };
};

export default useAgeInput;
