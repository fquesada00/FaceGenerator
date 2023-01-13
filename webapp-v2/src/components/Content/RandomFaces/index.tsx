import clsx from "clsx";
import { useMemo, useState } from "react";
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


const RandomFaces: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    mutate, isLoading
  } = useMutation(generateFaces, {
    onSuccess: (data) => {
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

  const onSubmit = () => {
    if (errorMessage !== "") {
      return;
    }

    if (amount === 0) {
      setErrorMessage("Amount is required");
      return;
    }

    // TODO: Generate faces logic
    console.log(`Generating ${amount} faces`);
    mutate(amount);
    // https://dummyimage.com/600x400/ff00ff/ededed&text=this+is+a+face
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
        </div>
      </form>
    </div>
  );
}

export default RandomFaces;