import { useField } from 'formik';
import useAutocompleteTags from 'hooks/useAutocompleteTags';
import React from 'react';

interface FormikAutoCompleteTagsProps {
  name: string;
  label?: string;
  allowUserInput?: boolean;
}

const FormikAutoCompleteTags = (props: FormikAutoCompleteTagsProps) => {
  const { allowUserInput = false, name, label = '' } = props;

  const [field, meta, helpers] = useField(name);

  const { Autocomplete } = useAutocompleteTags({
    label,
    allowUserInput,
    formikAutoCompleteTagsProps: {
      onChange: (_, value) => {
        helpers.setValue(value);
      },
      autocompleteProps: {
        field,
        onOpen: () => helpers.setTouched(true)
      },
      textFieldProps: {
        error: meta.touched && !!meta.error,
        helperText: meta.touched && meta.error
      }
    }
  });

  return <React.Fragment>{Autocomplete}</React.Fragment>;
};

export default FormikAutoCompleteTags;
