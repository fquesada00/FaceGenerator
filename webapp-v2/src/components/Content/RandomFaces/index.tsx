import { Button, Typography } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import { MIN_FACES, MAX_FACES } from "components/utils";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "components/Content/styles/Content.module.scss"
import CustomAmountInput from "components/Inputs/custom/CustomAmountInput";
import CtaButton from "components/CtaButton";

const RandomFaces: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    // https://dummyimage.com/600x400/ff00ff/ededed&text=this+is+a+face
  }

  return (
    <div>
      <Typography variant="h5">
        Enter the amount of faces (between {MIN_FACES} and {MAX_FACES}) that you want to see.
        <br />
        The results will be displayed below.
      </Typography>
      <form>
        <div className={clsx(inputsClasses.container)}>
          <CustomAmountInput setAmount={setAmount} setErrorMessage={setErrorMessage} errorMessage={errorMessage} />
          <CtaButton onSubmit={onSubmit} label="Generate" className="mt-8"/>
        </div>
      </form>
    </div>
  );
}

export default RandomFaces;