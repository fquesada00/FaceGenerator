import { FieldInputProps } from "formik";

type FormikAutocompleteTagsProps = {
  field: FieldInputProps<any>;
  onOpen: () => void;
};

type FormikTextFieldTagsProps = {
  error: boolean;
  helperText: string | undefined | false;
};

export type FormikAutoCompleteTagsProps = {
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
  autocompleteProps: FormikAutocompleteTagsProps;
  textFieldProps: FormikTextFieldTagsProps;
};