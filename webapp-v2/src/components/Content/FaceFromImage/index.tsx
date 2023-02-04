import { Grid, Typography } from "@mui/material";
import clsx from "clsx";
import AddSvg from "assets/add-svgrepo-com.svg";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "components/Content/styles/Content.module.scss"
import { useRef, useCallback, useState } from "react";
import { Box } from "@mui/system";
import CtaButton from "components/CtaButton";
import ContentHeader from "components/ContentHeader";
import paths from "routes/paths";
import ImagePlaceholder from "components/Images/ImagePlaceholder";
import { useMutation } from "react-query";
import { generateFaceFromImage } from "services/api/FaceGeneratorApi";
import { toastError } from "components/Toast";
import ApiError from "services/api/Error";
import ImageTemplate from "components/Images/ImageTemplate";

const FaceFromImage: React.FC = () => {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    mutate: mutateGenerateFaceFromImage, isLoading: isLoadingFaceFromImage, data: faceFromImage
  } = useMutation(generateFaceFromImage, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const onClickImage = () => {
    inputRef?.current?.click();
  }

  const onPickImage = () => {
    if (inputRef?.current?.files?.length === 0) {
      return;
    }

    const file = inputRef?.current?.files?.[0] || null;
    setImageFile(file);
  }

  const onGenerateFaceFromImage = () => {
    if (!imageFile) {
      return;
    }

    mutateGenerateFaceFromImage(imageFile);
  }

  const renderImagePicker = useCallback(() => {
    if (!imageFile) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-24 h-24 rounded-full border-stone-900" style={{ borderWidth: "0.25rem" }}>
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src={AddSvg} alt="Add SVG" />
            </div>
          </div>
        </div>
      );
    }

    const imageSrc = URL.createObjectURL(imageFile);

    return (
      <div className="w-full h-full">
        <img className="w-full h-full" src={imageSrc} alt="Your face image" style={{ objectFit: "cover" }} />
      </div>
    );
  }, [inputRef, AddSvg, imageFile]);

  return (
    <div>
      <ContentHeader
        title={paths.faceFromImage.title}
        subtitle="Upload a face image to generate a face from it. The image should be in .jpg or .png format. The generated one is located in the latent space of the NN."
      />
      <div className={clsx(inputsClasses.container)}>
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} container direction="column" alignItems="center" justifyContent="center">
            <Box
              className="rounded-lg border-stone-900" style={{ borderWidth: "0.25rem" }} onClick={onClickImage}
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
              <input type="file" accept="image/jpeg, image/png" className="hidden" ref={inputRef} onChange={onPickImage} />
              {
                renderImagePicker()
              }
            </Box>
            <CtaButton label="Generate" onClick={onGenerateFaceFromImage} className="mt-8" loading={isLoadingFaceFromImage} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} container direction="column" alignItems="center" >
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
              src={faceFromImage?.image}
              alt="Generated face"
              placeholderText="Your generated face will appear here"
              cardHeightClassName="h-full"
              cardWidthClassName="w-full"
              imgHeightClassName="h-5/6"
            />
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default FaceFromImage;