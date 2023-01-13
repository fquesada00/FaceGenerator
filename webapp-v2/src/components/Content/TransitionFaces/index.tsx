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

const TransitionFaces: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const [amount, setAmount] = useState<number>(0);
  const [amountErrorMessage, setAmountErrorMessage] = useState<string>("");

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
      <ContentHeader
        title={paths.transitionFaces.title}
        subtitle={renderSubtitle}
      />
      <form>
        <div className={clsx(inputsClasses.container)}>
          <Grid container style={{ width: "25rem" }} rowSpacing={4}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" />
              <CtaButton onSubmit={() => { }} label="Pick face" className="mt-2" />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} required label="Second ID" />
              <CtaButton onSubmit={() => { }} label="Pick face" className="mt-2" />
            </Grid>
          </Grid>
          <div className="mt-8">
            <CustomAmountInput setAmount={setAmount} setErrorMessage={setAmountErrorMessage} errorMessage={amountErrorMessage} />
            <CtaButton onSubmit={onSubmit} label="Generate" className="mt-8" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default TransitionFaces;