import { Grid } from "@mui/material"
import clsx from "clsx"
import { useMemo } from "react"
import { Formik, Form } from "formik"

import inputsClasses from "components/Inputs/styles/Inputs.module.scss"
import CtaButton from "components/CtaButton"
import ContentHeader from "components/ContentHeader"
import paths from "routes/paths"
import { toastError } from "components/Toast"
import useRenderImages from "hooks/useRenderImages"
import { useMutation } from "react-query"
import ApiError from "services/api/Error"
import PickImageButton from "components/CtaButton/custom/PickImageButton"
import {
  transitionFacesSchema,
  TransitionFacesFormValues,
  initialValues,
} from "forms/transitionFaces"
import FormikCustomIdInput from "components/Inputs/formik/custom/FormikCustomIdInput"
import FormikCustomAmountInput from "components/Inputs/formik/custom/FormikCustomAmountInput"
import useFacesApi from "hooks/api/useFacesApi"

const TransitionFaces: React.FC = () => {
  const { generateTransitions } = useFacesApi()
  const {
    mutate: mutateGenerateTransitions,
    isLoading: isLoadingTransitions,
    data: transitionFaces,
  } = useMutation(generateTransitions, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString())
      }
    },
  })

  const { images: TransitionFacesImages } = useRenderImages({
    faces: transitionFaces,
  })

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Generate an amount of transitions between two faces.
        <br />
        The results will be displayed below.
      </div>
    )
  }, [])

  const onSubmit = ({
    firstId,
    secondId,
    amount,
  }: TransitionFacesFormValues) => {
    mutateGenerateTransitions({ fromId: firstId, toId: secondId, amount })
  }

  return (
    <div>
      <ContentHeader
        title={paths.transitionFaces.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={transitionFacesSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className={clsx(inputsClasses.container)}>
              <Grid container style={{ width: "25rem" }} rowSpacing={4}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <FormikCustomIdInput
                    required
                    label="First ID"
                    name="firstId"
                  />
                  <PickImageButton
                    onDone={(faceId) => setFieldValue("firstId", faceId ?? 0)}
                    pickedFaceId={values.firstId}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <FormikCustomIdInput
                    required
                    label="Second ID"
                    name="secondId"
                  />
                  <PickImageButton
                    onDone={(faceId) => setFieldValue("secondId", faceId ?? 0)}
                    pickedFaceId={values.secondId}
                  />
                </Grid>
              </Grid>
              <div className="mt-8">
                <FormikCustomAmountInput name="amount" />
                <CtaButton
                  type="submit"
                  label="Generate"
                  className="mt-8"
                  loading={isLoadingTransitions}
                />
                {!isLoadingTransitions && TransitionFacesImages}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default TransitionFaces
