import clsx from "clsx"
import { useField } from "formik"
import { MIN_FACES, MAX_FACES } from "constants"
import FormikAmountInput from "../FormikAmountInput"

import inputsClasses from "components/Inputs/styles/Inputs.module.scss"

type FormikCustomAmountInputProps = {
  name: string
}

const FormikCustomAmountInput = (props: FormikCustomAmountInputProps) => {
  const { name } = props

  return (
    <div className={clsx(inputsClasses.field)}>
      <FormikAmountInput min={MIN_FACES} max={MAX_FACES} name={name} />
    </div>
  )
}

export default FormikCustomAmountInput
