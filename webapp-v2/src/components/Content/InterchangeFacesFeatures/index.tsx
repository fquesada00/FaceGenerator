import { Grid } from '@mui/material';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Formik, Form } from 'formik';

import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import CtaButton from 'components/CtaButton';
import ContentHeader from 'components/ContentHeader';
import paths from 'routes/paths';
import { toastError } from 'components/Toast';
import useRenderImages from 'hooks/useRenderImages';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import PickImageButton from 'components/CtaButton/custom/PickImageButton';
import FormikCustomIdInput from 'components/Inputs/formik/custom/FormikCustomIdInput';
import {
  initialValues,
  interchangeFaceFeaturesSchema,
  InterchangeFaceFeaturesFormValues
} from 'forms/interchangeFaceFeatures';
import useFacesApi from 'hooks/api/useFacesApi';
import interchangeFeaturesJson from 'assets/data/interchange_features.json';

const InterchangeFacesFeatures: React.FC = () => {
  const { interchangeFacesFeatures } = useFacesApi();

  const renderSubtitle = useMemo(
    () => (
      <div>
        {interchangeFeaturesJson.subtitle}
        <br />
        The results will be displayed below.
      </div>
    ),
    [interchangeFeaturesJson]
  );

  const {
    mutate: mutateInterchangeFacesFeatures,
    isLoading: isLoadingInterchange,
    data: interchangedFaces
  } = useMutation(interchangeFacesFeatures, {
    onError: error => {
      if (error instanceof ApiError && error.status !== 401) {
        toastError(error.toString());
      }
    }
  });

  const { images: InterchangedFacesImages } = useRenderImages({
    faces: interchangedFaces
  });

  const onSubmit = ({
    firstId,
    secondId
  }: InterchangeFaceFeaturesFormValues) => {
    mutateInterchangeFacesFeatures({ firstId, secondId });
  };

  return (
    <div>
      <ContentHeader
        title={paths.interchangeFacesFeatures.title}
        subtitle={renderSubtitle}
      />
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={interchangeFaceFeaturesSchema}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className={clsx(inputsClasses.container)}>
              <Grid container style={{ width: '25rem' }} rowSpacing={4}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <FormikCustomIdInput
                    required
                    label='First ID'
                    name='firstId'
                  />
                  <PickImageButton
                    onDone={faceId => setFieldValue('firstId', faceId ?? '0')}
                    pickedFaceId={values.firstId}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <FormikCustomIdInput
                    required
                    label='Second ID'
                    name='secondId'
                  />
                  <PickImageButton
                    onDone={faceId => setFieldValue('secondId', faceId ?? '0')}
                    pickedFaceId={values.secondId}
                  />
                </Grid>
              </Grid>
              <CtaButton
                type='submit'
                label='Generate'
                className='mt-8'
                loading={isLoadingInterchange}
              />
              {!isLoadingInterchange && InterchangedFacesImages}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InterchangeFacesFeatures;
