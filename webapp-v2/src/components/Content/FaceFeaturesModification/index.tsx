import ContentHeader from "components/ContentHeader";
import { useMemo, useState } from "react";
import paths from "routes/paths";
import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import clsx from "clsx";
import PickImageButton from "components/CtaButton/custom/PickImageButton";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";
import { toastError } from "components/Toast";
import { useMutation } from "react-query";
import ApiError from "services/api/Error";
import { modifyFaceFeatures } from "services/api/FaceGeneratorApi";
import FeatureModificationSection from "./components/FeatureModificationSection";
import CtaButton from "components/CtaButton";
import useAgeInput from "./hooks/useAgeInput";
import { Box, Grid } from "@mui/material";
import useSlider from "./hooks/useSlider";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { IApiFaceFeatures } from "services/api/models";
import ImageTemplate from "components/Images/ImageTemplate";

const FaceFeaturesModification: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [idErrorMessage, setIdErrorMessage] = useState<string>("");

  // General section
  const { AgeInput, age } = useAgeInput();
  const { CustomSlider: GenderSlider, value: gender } = useSlider({ title: 'Gender', LeftIcon: <FemaleIcon />, RightIcon: <MaleIcon /> });

  // Face orientation section
  const { CustomSlider: FaceVerticalOrientationSlider, value: faceVerticalOrientation } = useSlider({ title: 'Vertical' });
  const { CustomSlider: FaceHorizontalOrientationSlider, value: faceHorizontalOrientation } = useSlider({ title: 'Horizontal' });

  // Face eyes section
  const { CustomSlider: EyesDistanceSlider, value: eyesDistanceValue } = useSlider({ title: 'Distance' });
  const { CustomSlider: EyesToEyeBrowsDistanceSlider, value: eyesToEyeBrowsDistanceValue } = useSlider({ title: 'Distance to Eye Brows' });
  const { CustomSlider: EyesRatioSlider, value: eyesRatioValue } = useSlider({ title: 'Ratio' });
  const { CustomSlider: EyesOpenSlider, value: eyesOpenValue } = useSlider({ title: 'Open' });
  const { CustomSlider: EyesRollSlider, value: eyesRollValue } = useSlider({ title: 'Roll' });

  // Face mouth section
  const { CustomSlider: MouthLipRatioSlider, value: mouthLipRatioValue } = useSlider({ title: 'Lip Ratio' });
  const { CustomSlider: MouthOpenSlider, value: mouthOpenValue } = useSlider({ title: 'Open' });
  const { CustomSlider: MouthRatioSlider, value: mouthRatioValue } = useSlider({ title: 'Ratio' });
  const { CustomSlider: MouthSmileSlider, value: mouthSmileValue } = useSlider({ title: 'Smile' });

  // Face nose section
  const { CustomSlider: NoseToMouthDistanceSlider, value: noseToMouthDistanceValue } = useSlider({ title: 'Distance to Mouth' });
  const { CustomSlider: NoseRatioSlider, value: noseRatioValue } = useSlider({ title: 'Ratio' });
  const { CustomSlider: NoseTipHeightSlider, value: noseTipHeightValue } = useSlider({ title: 'Tip' });

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Change the face features of any of the saved faces. The features are grouped by sections. You can change the value of each feature by using the slider or by typing the value in the input field.
        <br />
        The results will be displayed below.
      </div>
    )
  }, []);

  const {
    mutate: mutateModifyFaceFeatures, isLoading: isLoadingModifyFace, data: modifiedFace
  } = useMutation(modifyFaceFeatures, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const onSubmit = () => {
    if (idErrorMessage !== "" && id <= 0) {
      return;
    }

    let hasError = false;

    if (id === 0) {
      setIdErrorMessage("ID is required");
      hasError = true;
    } else {
      setIdErrorMessage("");
    }


    if (hasError) {
      return;
    }

    setIdErrorMessage("");

    const faceFeatures: IApiFaceFeatures = {
      age,
      gender,
      orientation: {
        vertical: faceVerticalOrientation,
        horizontal: faceHorizontalOrientation
      },
      eyes: {
        distance: eyesDistanceValue,
        distanceToEyeBrows: eyesToEyeBrowsDistanceValue,
        ratio: eyesRatioValue,
        open: eyesOpenValue,
        roll: eyesRollValue
      },
      mouth: {
        lipRatio: mouthLipRatioValue,
        open: mouthOpenValue,
        ratio: mouthRatioValue,
        smile: mouthSmileValue
      },
      nose: {
        distanceToMouth: noseToMouthDistanceValue,
        ratio: noseRatioValue,
        tip: noseTipHeightValue,
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
      <form>
        <div className={clsx(inputsClasses.container)}>
          <CustomIdInput setId={setId} setErrorMessage={setIdErrorMessage} errorMessage={idErrorMessage} required id={id} />
          <PickImageButton onDone={(faceId) => setId(faceId ?? 0)} pickedFaceId={id} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FeatureModificationSection title="General">
                {AgeInput}
                {GenderSlider}
              </FeatureModificationSection>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FeatureModificationSection title="Face orientation">
                {FaceVerticalOrientationSlider}
                {FaceHorizontalOrientationSlider}
              </FeatureModificationSection>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FeatureModificationSection title="Eyes">
                {EyesDistanceSlider}
                {EyesToEyeBrowsDistanceSlider}
                {EyesRatioSlider}
                {EyesOpenSlider}
                {EyesRollSlider}
              </FeatureModificationSection>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FeatureModificationSection title="Mouth">
                {MouthLipRatioSlider}
                {MouthOpenSlider}
                {MouthRatioSlider}
                {MouthSmileSlider}
              </FeatureModificationSection>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FeatureModificationSection title="Nose">
                {NoseToMouthDistanceSlider}
                {NoseRatioSlider}
                {NoseTipHeightSlider}
              </FeatureModificationSection>
            </Grid>
          </Grid>
          <CtaButton onClick={onSubmit} label="Generate" className="mt-8" loading={isLoadingModifyFace} />
          <div className="mt-8 justify-center flex items-center w-full">
            <Box
              sx={{
                width: {
                  xs: "14rem",
                  sm: "18rem",
                  md: "22rem",
                  lg: "24rem",
                  xl: "28rem",
                },
                height: {
                  xs: "14rem",
                  sm: "18rem",
                  md: "22rem",
                  lg: "24rem",
                  xl: "28rem",
                }
              }}
            >
              <ImageTemplate
                src={modifiedFace?.image}
                alt="Modified face"
                placeholderText="Your modified face will be displayed here"
                cardHeightClassName="h-full"
                cardWidthClassName="w-full"
                imgHeightClassName="h-5/6"
              />
            </Box>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FaceFeaturesModification;