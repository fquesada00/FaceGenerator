import { Typography, Grid, Button } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import CtaButton from "components/CtaButton";

const InterchangeFacesFeatures: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const onSubmit = () => {
    if (firstIdErrorMessage !== "" || secondIdErrorMessage !== "") {
      return;
    }

    if (firstId === 0) {
      setFirstIdErrorMessage("First ID is required");
    }

    if (secondId === 0) {
      setSecondIdErrorMessage("Second ID is required");
      return;
    }


    // TODO: Generate faces logic
    console.log(`Generating ${2} faces`);
    // https://dummyimage.com/600x400/ff00ff/ededed&text=this+is+a+face
  }

  return (
    <div>
      <Typography variant="h5">
        Interchange the features (styles) of two faces.
        <br />
        The results will be displayed below.
      </Typography>
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
          <CtaButton onSubmit={onSubmit} label="Generate" className="mt-8"/>
        </div>
      </form>
    </div>
  );
}

export default InterchangeFacesFeatures;