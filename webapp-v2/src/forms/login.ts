import * as Yup from "yup"

export interface LoginFormValues {
  username: string
  password: string
}

export const initialValues: LoginFormValues = {
  username: "",
  password: "",
}

export const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
})
