import clsx from "clsx"
import FormikIdInput from "../FormikIdInput"

import inputsClasses from "components/Inputs/styles/Inputs.module.scss"

type FormikCustomIdInputProps = {
  name: string
  required?: boolean
  label?: string
}

const FormikCustomIdInput = (props: FormikCustomIdInputProps) => {
  const { required, label, name } = props

  return (
    <div className={clsx(inputsClasses.field)}>
      <FormikIdInput label={label} name={name} required={required} />
    </div>
  )
}

export default FormikCustomIdInput
