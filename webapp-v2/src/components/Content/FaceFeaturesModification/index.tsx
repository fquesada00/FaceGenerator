import ContentHeader from 'components/ContentHeader';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import paths from 'routes/paths';
import inputsClasses from 'components/Inputs/styles/Inputs.module.scss';
import clsx from 'clsx';
import PickImageButton from 'components/CtaButton/custom/PickImageButton';
import CustomIdInput from 'components/Inputs/custom/CustomIdInput';
import { toastError } from 'components/Toast';
import { useMutation } from 'react-query';
import ApiError from 'services/api/Error';
import CtaButton from 'components/CtaButton';
import { Box, Button, Grid } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { IApiFaceFeatures } from 'services/api/models';
import ImageTemplate from 'components/Images/ImageTemplate';
import {
  ModifyFaceFeaturesFormValues,
  initialValues,
  modifyFaceFeaturesSchema
} from 'forms/modifyFaceFeatures';
import FormikCustomIdInput from 'components/Inputs/formik/custom/FormikCustomIdInput';
import FormikNumericInput from 'components/Inputs/formik/FormikNumericInput';
import { MAX_AGE, MIN_AGE } from 'constants/constants';
import FormikCustomSlider from 'components/Inputs/formik/custom/FormikCustomSlider';
import useFacesApi from 'hooks/api/useFacesApi';
import FeatureModificationSection from './components/FeatureModificationSection';
import CenteredCircularLoader from 'components/Loaders/CenteredCircularLoader';
import featuresModificationJson from 'assets/data/features_modification.json';

const FaceFeaturesModification: React.FC = () => {
  const { modifyFaceFeatures } = useFacesApi();

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const renderSubtitle = useMemo(
    () => (
      <div>
        {featuresModificationJson.subtitle}
        <br />
        The results will be displayed below.
      </div>
    ),
    [featuresModificationJson]
  );

  const {
    mutate: mutateModifyFaceFeatures,
    isLoading: isLoadingModifyFace,
    data: modifiedFace
  } = useMutation(modifyFaceFeatures, {
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const onSubmit = ({
    id,
    age,
    gender,
    faceOrientationVertical,
    faceOrientationHorizontal,
    eyeDistance,
    eyebrowsDistance,
    eyesRatio,
    eyesOpen,
    eyesRoll,
    mouthLipRatio,
    mouthOpen,
    mouthRatio,
    mouthSmile,
    noseDistance,
    noseRatio,
    noseTip
  }: ModifyFaceFeaturesFormValues) => {
    const faceFeatures: IApiFaceFeatures = {
      age: age,
      gender: gender,
      pitch: faceOrientationVertical,
      yaw: faceOrientationHorizontal,
      roll: eyesRoll,
      eyeDistance: eyeDistance,
      eyeEyebrowDistance: eyebrowsDistance,
      eyeRatio: eyesRatio,
      eyesOpen: eyesOpen,
      lipRatio: mouthLipRatio,
      mouthOpen: mouthOpen,
      mouthRatio: mouthRatio,
      noseMouthDistance: noseDistance,
      noseRatio: noseRatio,
      noseTip: noseTip,
      smile: mouthSmile
    };

    mutateModifyFaceFeatures({ id, faceFeatures });
  };

  const onChangeCommitted = () => {
    submitButtonRef.current?.click();
  };

  return (
    <div>
      <ContentHeader
        title={paths.faceFeaturesModification.title}
        subtitle={renderSubtitle}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={modifyFaceFeaturesSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className={clsx(inputsClasses.container)}>
              <FormikCustomIdInput name='id' required />
              <PickImageButton
                onDone={faceId => setFieldValue('id', faceId ?? 0)}
                pickedFaceId={values.id}
              />
              <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className='flex justify-center relative'
                >
                  <Box
                    className='overflow-y-auto pr-3 py-3'
                    sx={{
                      width: {
                        xs: '15rem',
                        sm: '20rem',
                        md: '24rem',
                        lg: '26rem',
                        xl: '30rem'
                      },
                      height: {
                        xs: '18rem',
                        sm: '22rem',
                        md: '26rem',
                        lg: '30rem',
                        xl: '34rem'
                      }
                    }}
                  >
                    {isLoadingModifyFace && (
                      <div
                        style={{ width: 'inherit', height: 'inherit' }}
                        className='absolute bg-black bg-opacity-30 z-10'
                      >
                        <CenteredCircularLoader className='w-full h-full' />
                      </div>
                    )}
                    <FeatureModificationSection title='General' first>
                      <FormikNumericInput
                        name='age'
                        label='Age'
                        required={false}
                        min={-MAX_AGE}
                        max={MAX_AGE}
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Gender'
                        name='gender'
                        LeftIcon={<FemaleIcon />}
                        RightIcon={<MaleIcon />}
                        onChangeCommitted={onChangeCommitted}
                      />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Face orientation'>
                      <FormikCustomSlider
                        title='Vertical'
                        name='faceOrientationVertical'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Horizontal'
                        name='faceOrientationHorizontal'
                        onChangeCommitted={onChangeCommitted}
                      />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Eyes'>
                      <FormikCustomSlider
                        title='Distance'
                        name='eyeDistance'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Distance to Eye Brows'
                        name='eyebrowsDistance'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Ratio'
                        name='eyesRatio'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Open'
                        name='eyesOpen'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Roll'
                        name='eyesRoll'
                        onChangeCommitted={onChangeCommitted}
                      />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Mouth'>
                      <FormikCustomSlider
                        title='Lip Ratio'
                        name='mouthLipRatio'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Open'
                        name='mouthOpen'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Ratio'
                        name='mouthRatio'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Smile'
                        name='mouthSmile'
                        onChangeCommitted={onChangeCommitted}
                      />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Nose'>
                      <FormikCustomSlider
                        title='Distance to Mouth'
                        name='noseDistance'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Ratio'
                        name='noseRatio'
                        onChangeCommitted={onChangeCommitted}
                      />
                      <FormikCustomSlider
                        title='Tip'
                        name='noseTip'
                        onChangeCommitted={onChangeCommitted}
                      />
                    </FeatureModificationSection>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <div className='mt-8 justify-center flex items-center w-full'>
                    <Box
                      sx={{
                        width: {
                          xs: '14rem',
                          sm: '18rem',
                          md: '22rem',
                          lg: '24rem',
                          xl: '28rem'
                        },
                        height: {
                          xs: '14rem',
                          sm: '18rem',
                          md: '22rem',
                          lg: '24rem',
                          xl: '28rem'
                        }
                      }}
                    >
                      <ImageTemplate
                        faceId={modifiedFace?.id}
                        alt='Modified face'
                        placeholderText='Your modified face will be displayed here'
                        cardHeightClassName='h-full'
                        cardWidthClassName='w-full'
                        imgHeightClassName='h-5/6'
                      />
                    </Box>
                  </div>
                </Grid>
              </Grid>
              <Button type='submit' className='hidden' ref={submitButtonRef} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FaceFeaturesModification;
