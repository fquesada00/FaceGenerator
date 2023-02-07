import * as Yup from "yup"
import { minMaxField } from "./commons"

const RandomFacesFormSchema = ({ min, max }: { min: number; max: number }) =>
  Yup.object().shape({
    "random-faces": minMaxField(min, max),
  })

export default RandomFacesFormSchema
