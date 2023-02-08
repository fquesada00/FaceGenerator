import * as Yup from "yup"
import { minMaxField } from "./commons"
import { MAX_FACES, MIN_FACES } from "constants"

export interface RandomFacesFormValues {
  randomFaces: number
}

export const initialValues: RandomFacesFormValues = {
  randomFaces: 0,
}

export const randomFacesFormSchema = Yup.object().shape({
  randomFaces: minMaxField(MIN_FACES, MAX_FACES),
})
