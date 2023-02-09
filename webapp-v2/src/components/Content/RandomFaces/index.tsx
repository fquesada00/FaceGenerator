import clsx from "clsx"
import { useMemo, useState } from "react"
import { Formik, Form } from "formik"
import { MIN_FACES, MAX_FACES } from "constants"

import inputsClasses from "components/Inputs/styles/Inputs.module.scss"
import CustomAmountInput from "components/Inputs/custom/CustomAmountInput"
import CtaButton from "components/CtaButton"
import ContentHeader from "components/ContentHeader"
import paths from "routes/paths"
import { useMutation } from "react-query"
import { generateFaces } from "services/api/FaceGeneratorApi"
import ApiError from "services/api/Error"
import { toastError } from "components/Toast"
import useRenderImages from "hooks/useRenderImages"
import FormikCustomAmountInput from "components/Inputs/formik/custom/FormikCustomAmountInput"
import {
  randomFacesFormSchema,
  RandomFacesFormValues,
  initialValues,
} from "forms/randomFaces"

const RandomFaces: React.FC = () => {
  const {
    mutate,
    isLoading,
    data: faces,
  } = useMutation(generateFaces, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString())
      }
    },
  })

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Enter the amount of faces (between {MIN_FACES} and {MAX_FACES}) that you
        want to see.
        <br />
        The results will be displayed below.
      </div>
    )
  }, [])

  const { images: FacesImages } = useRenderImages({ faces })

  const onSubmit = ({ randomFaces: amount }: RandomFacesFormValues) => {
    mutate(amount)
  }

  return (
    <div>
      <ContentHeader
        title={paths.randomFaces.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={randomFacesFormSchema}
      >
        <Form>
          <div className={clsx(inputsClasses.container)}>
            <FormikCustomAmountInput name="randomFaces" />
            <CtaButton
              type="submit"
              label="Generate"
              className="mt-8"
              loading={isLoading}
            />
            {!isLoading && FacesImages}
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default RandomFaces
