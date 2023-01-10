import { Typography, Grid, Button } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";
import CustomAmountInput from "components/Inputs/custom/CustomAmountInput";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "components/Content/styles/Content.module.scss"

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
          <Grid container style={{ width: "25rem" }}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" />
              <div className={clsx(contentClasses.cta, "mt-2")}>
                <Button variant="contained" color="primary" fullWidth onClick={() => { }}>
                  Pick face
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} required label="Second ID" />
              <div className={clsx(contentClasses.cta, "mt-2")}>
                <Button variant="contained" color="primary" fullWidth onClick={() => { }}>
                  Pick face
                </Button>
              </div>
            </Grid>
          </Grid>
          <div className={clsx(contentClasses.cta, "mt-8")}>
            <Button variant="contained" color="primary" fullWidth onClick={onSubmit}>
              Generate
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InterchangeFacesFeatures;