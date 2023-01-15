import { Typography, Grid, Button } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";
import CustomAmountInput from "components/Inputs/custom/CustomAmountInput";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "components/Content/styles/Content.module.scss"
import CtaButton from "components/CtaButton";
import ContentHeader from "components/ContentHeader";
import paths from "routes/paths";
import { toastError } from "components/Toast";
import useRenderImages from "hooks/useRenderImages";
import { useMutation } from "react-query";
import ApiError from "services/api/Error";
import { generateTransitions, getAllFaces } from "services/api/FaceGeneratorApi";
import PickImageButton from "components/CtaButton/custom/PickImageButton";

const TransitionFaces: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const [amount, setAmount] = useState<number>(0);
  const [amountErrorMessage, setAmountErrorMessage] = useState<string>("");

  const {
    mutate: mutateGenerateTransitions, isLoading: isLoadingTransitions, data: transitionFaces
  } = useMutation(generateTransitions, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { images: TransitionFacesImages } = useRenderImages({ faces: transitionFaces })

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Generate an amount of transitions between two faces.
        <br />
        The results will be displayed below.
      </div>
    )
  }, [])

  const onSubmit = () => {
    if (amountErrorMessage !== "" || (firstIdErrorMessage !== "" && firstId <= 0) || (secondIdErrorMessage !== "" && secondId <= 0)) {
      return;
    }

    let hasError = false;

    if (firstId === 0) {
      setFirstIdErrorMessage("First ID is required");
      hasError = true;
    } else {
      setFirstIdErrorMessage("");
    }

    if (secondId === 0) {
      setSecondIdErrorMessage("Second ID is required");
      hasError = true;
    } else {
      setSecondIdErrorMessage("");
    }

    if (amount === 0) {
      setAmountErrorMessage("Amount is required");
      hasError = true;
    } else {
      setAmountErrorMessage("");
    }

    if (hasError) {
      return;
    }

    setFirstIdErrorMessage("");
    setSecondIdErrorMessage("");
    setAmountErrorMessage("");
    mutateGenerateTransitions({ fromId: firstId, toId: secondId, amount });
  }

  return (
    <div>
      <ContentHeader
        title={paths.transitionFaces.title}
        subtitle={renderSubtitle}
      />
      <form>
        <div className={clsx(inputsClasses.container)}>
          <Grid container style={{ width: "25rem" }} rowSpacing={4}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" id={firstId} />
              <PickImageButton onDone={(faceId) => setFirstId(faceId ?? 0)} pickedFaceId={firstId} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} required label="Second ID" id={secondId} />
              <PickImageButton onDone={(faceId) => setSecondId(faceId ?? 0)} pickedFaceId={secondId} />
            </Grid>
          </Grid>
          <div className="mt-8">
            <CustomAmountInput setAmount={setAmount} setErrorMessage={setAmountErrorMessage} errorMessage={amountErrorMessage} amount={amount} />
            <CtaButton onClick={onSubmit} label="Generate" className="mt-8" loading={isLoadingTransitions} />
            {
              !isLoadingTransitions && TransitionFacesImages
            }
          </div>
        </div>
      </form>
    </div>
  );
}

export default TransitionFaces;