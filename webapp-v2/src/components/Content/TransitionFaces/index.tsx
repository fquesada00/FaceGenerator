import { Typography, Grid, Button } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import AmountInput from "components/Inputs/AmountInput";
import { MIN_FACES, MAX_FACES } from "components/utils";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "../styles/Content.module.scss"
import CustomAmountInput from "components/Inputs/custom/CustomAmountInput";

const TransitionFaces: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const [hideAll, setHideAll] = useState<boolean>(true);

  const [amount, setAmount] = useState<number>(0);
  const [amountErrorMessage, setAmountErrorMessage] = useState<string>("");

  const onSubmit = () => {
    if (amountErrorMessage !== "" || firstIdErrorMessage !== "" || secondIdErrorMessage !== "") {
      return;
    }

    if (firstId === 0) {
      setFirstIdErrorMessage("First ID is required");
    }

    if (secondId === 0) {
      setSecondIdErrorMessage("Second ID is required");
    }

    if (amount === 0) {
      setAmountErrorMessage("Amount is required");
      return;
    }

    // TODO: Generate faces logic
    console.log(`Generating ${amount} faces`);
    // https://dummyimage.com/600x400/ff00ff/ededed&text=this+is+a+face
  }

  return (
    <div>
      <Typography variant="h5">
        Lookup for the faces that you want to see.
        <br />
        The results will be displayed below.
      </Typography>
      <form>
        <div className={clsx(inputsClasses.container)}>
          <Grid container style={{ width: "25rem" }}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} required label="Second ID" />
            </Grid>
          </Grid>
          <CustomAmountInput setAmount={setAmount} setErrorMessage={setAmountErrorMessage} errorMessage={amountErrorMessage} />
          <div className={clsx(contentClasses.cta)}>
            <Button variant="contained" color="primary" fullWidth onClick={onSubmit}>
              Generate
            </Button>
          </div>
          <div className={clsx(contentClasses.cta, "mt-6")}>
            <Button variant="contained" color="primary" fullWidth onClick={() => setHideAll(!hideAll)}>
              {!hideAll ? "Hide" : "Show"} all
            </Button>
          </div>
          {
            !hideAll
            &&
            <h1 className="text-3xl font-bold underline">
              Hello world!
            </h1>
          }
        </div>
      </form>
    </div>
  );
}

export default TransitionFaces;