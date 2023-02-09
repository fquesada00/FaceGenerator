import FormikNumericInput from "./FormikNumericInput"

type FormikIdInputProps = {
  name: string
  required?: boolean
  label?: string
}

const FormikIdInput = (props: FormikIdInputProps) => {
  const { name, required = false, label } = props

  return (
    <FormikNumericInput
      name={name}
      label={label ?? "ID"}
      required={required}
      min={1}
    />
  )
}

export default FormikIdInput
