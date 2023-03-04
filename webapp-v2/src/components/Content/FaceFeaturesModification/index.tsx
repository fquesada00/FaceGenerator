import ContentHeader from 'components/ContentHeader';
import { useMemo, useState } from 'react';
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
import { Box, Grid } from '@mui/material';
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
import useSlider from './hooks/useSlider';
import useAgeInput from './hooks/useAgeInput';
import FeatureModificationSection from './components/FeatureModificationSection';

const FaceFeaturesModification: React.FC = () => {
  const { modifyFaceFeatures } = useFacesApi();

  const renderSubtitle = useMemo(
    () => (
      <div>
        Change the face features of any of the saved faces. The features are
        grouped by sections. You can change the value of each feature by using
        the slider or by typing the value in the input field.
        <br />
        The results will be displayed below.
      </div>
    ),
    []
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
      age,
      gender,
      orientation: {
        vertical: faceOrientationVertical,
        horizontal: faceOrientationHorizontal
      },
      eyes: {
        distance: eyeDistance,
        distanceToEyeBrows: eyebrowsDistance,
        ratio: eyesRatio,
        open: eyesOpen,
        roll: eyesRoll
      },
      mouth: {
        lipRatio: mouthLipRatio,
        open: mouthOpen,
        ratio: mouthRatio,
        smile: mouthSmile
      },
      nose: {
        distanceToMouth: noseDistance,
        ratio: noseRatio,
        tip: noseTip
      }
    };

    mutateModifyFaceFeatures({ id, faceFeatures });
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
                  className='overflow-y-auto pr-1 pb-1'
                >
                  <Box
                    sx={{
                      width: {
                        xs: '13rem',
                        sm: '18rem',
                        md: '22rem',
                        lg: '24rem',
                        xl: '28rem'
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
                    <FeatureModificationSection title='General' first>
                      <FormikNumericInput
                        name='age'
                        label='Age'
                        required={false}
                        min={-MAX_AGE}
                        max={MAX_AGE}
                      />
                      <FormikCustomSlider
                        title='Gender'
                        name='gender'
                        LeftIcon={<FemaleIcon />}
                        RightIcon={<MaleIcon />}
                      />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Face orientation'>
                      <FormikCustomSlider
                        title='Vertical'
                        name='faceOrientationVertical'
                      />
                      <FormikCustomSlider
                        title='Horizontal'
                        name='faceOrientationHorizontal'
                      />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Eyes'>
                      <FormikCustomSlider title='Distance' name='eyeDistance' />
                      <FormikCustomSlider
                        title='Distance to Eye Brows'
                        name='eyebrowsDistance'
                      />
                      <FormikCustomSlider title='Ratio' name='eyesRatio' />
                      <FormikCustomSlider title='Open' name='eyesOpen' />
                      <FormikCustomSlider title='Roll' name='eyesRoll' />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Mouth'>
                      <FormikCustomSlider
                        title='Lip Ratio'
                        name='mouthLipRatio'
                      />
                      <FormikCustomSlider title='Open' name='mouthOpen' />
                      <FormikCustomSlider title='Ratio' name='mouthRatio' />
                      <FormikCustomSlider title='Smile' name='mouthSmile' />
                    </FeatureModificationSection>
                    <FeatureModificationSection title='Nose'>
                      <FormikCustomSlider
                        title='Distance to Mouth'
                        name='noseDistance'
                      />
                      <FormikCustomSlider title='Ratio' name='noseRatio' />
                      <FormikCustomSlider title='Tip' name='noseTip' />
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
                        src={modifiedFace?.image}
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
              <CtaButton
                type='submit'
                label='Generate'
                className='mt-8'
                loading={isLoadingModifyFace}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FaceFeaturesModification;
