import clsx from "clsx"
import { useMemo, useState } from "react"
import { Formik, Form } from "formik"
import inputsClasses from "components/Inputs/styles/Inputs.module.scss"
import CtaButton from "components/CtaButton"
import ContentHeader from "components/ContentHeader"
import paths from "routes/paths"
import { useMutation } from "react-query"
import { toastError } from "components/Toast"
import ApiError from "services/api/Error"
import { getAllFaces, searchFaces } from "services/api/FaceGeneratorApi"
import useRenderImages from "hooks/useRenderImages"
import SearchFacesFormSchema from "forms/searchFaces"
import FormikAutoCompleteTags from "components/Inputs/formik/FormikAutoCompleteTags"

interface SearchFacesValues {
  tags: string[]
}

const SearchFaces: React.FC = () => {
  const [hideAll, setHideAll] = useState<boolean>(true)

  const {
    mutate: mutateSearchFaces,
    isLoading: isLoadingSearch,
    data: filteredFaces,
  } = useMutation(searchFaces, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString())
      }
    },
  })

  const { images: SearchFacesImages } = useRenderImages({
    faces: filteredFaces,
    disableSave: true,
  })

  const {
    mutate: mutateGetAllFaces,
    isLoading: isLoadingShowAll,
    data: allFaces,
  } = useMutation(getAllFaces, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString())
      }
    },
  })

  const { images: AllFacesImages } = useRenderImages({
    faces: allFaces,
    disableSave: true,
  })

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Lookup for the faces that you want to see.
        <br />
        The results will be displayed below.
      </div>
    )
  }, [])

  const onShowAll = () => {
    if (!allFaces && hideAll) {
      mutateGetAllFaces({})
    }
    setHideAll(!hideAll)
  }

  const onSubmit = ({ tags }: SearchFacesValues) => {
    mutateSearchFaces({ tags })
  }

  const initialValues: SearchFacesValues = useMemo(() => ({ tags: [] }), [])

  return (
    <div>
      <ContentHeader
        title={paths.searchFaces.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={SearchFacesFormSchema}
      >
        <Form>
          <div className={clsx(inputsClasses.container)}>
            <div className="flex justify-center">
              <div className="w-11/12">
                <FormikAutoCompleteTags name="tags" label="Search tags" />
              </div>
            </div>
            <CtaButton
              type="submit"
              label="Search"
              className="mt-8"
              loading={isLoadingSearch}
            />
            {!isLoadingSearch && filteredFaces && SearchFacesImages}
            <CtaButton
              onClick={onShowAll}
              label={`${!hideAll ? "Hide" : "Show"} all`}
              className="mt-4"
              loading={isLoadingShowAll}
            />
            {!hideAll && !isLoadingShowAll && AllFacesImages}
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default SearchFaces
