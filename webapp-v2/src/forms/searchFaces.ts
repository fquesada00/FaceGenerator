import * as Yup from "yup"
const SearchFacesFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(Yup.string().matches(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters"))
    .min(1, "At least one tag is required"),
})

export default SearchFacesFormSchema
