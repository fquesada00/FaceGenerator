import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { MIN_FACES, MAX_FACES } from "components/utils";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import CustomAmountInput from "components/Inputs/custom/CustomAmountInput";
import CtaButton from "components/CtaButton";
import ContentHeader from "components/ContentHeader";
import paths from "routes/paths";
import { useMutation } from "react-query";
import { generateFaces } from "services/api/FaceGeneratorApi";
import ApiError from "services/api/Error";
import { toastError } from "components/Toast";
import Images from "components/Images";


const RandomFaces: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    mutate, isLoading, data: faces
  } = useMutation(generateFaces, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Enter the amount of faces (between {MIN_FACES} and {MAX_FACES}) that you want to see.
        <br />
        The results will be displayed below.
      </div>
    )
  }, [])

  const renderImages = useMemo(() => {
    if (!faces) {
      return null;
    }

    return (
      <div className={clsx("mt-8")}>
        <Images faces={faces} />
      </div>
    );
  }, [faces])

  const onSubmit = () => {
    if (errorMessage !== "") {
      return;
    }

    if (amount === 0) {
      setErrorMessage("Amount is required");
      return;
    }

    mutate(amount);
  }

  return (
    <div>
      <ContentHeader
        title={paths.randomFaces.title}
        subtitle={renderSubtitle}
      />
      <form>
        <div className={clsx(inputsClasses.container)}>
          <CustomAmountInput setAmount={setAmount} setErrorMessage={setErrorMessage} errorMessage={errorMessage} />
          <CtaButton onSubmit={onSubmit} label="Generate" className="mt-8" loading={isLoading} />
          {
            !isLoading && renderImages
          }
        </div>
      </form>
    </div>
  );
}

export default RandomFaces;