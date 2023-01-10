import { Typography, Button, Grid } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "../styles/Content.module.scss"
import CustomIdInput from "components/Inputs/custom/CustomIdInput";


const SearchFaces: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const [hideAll, setHideAll] = useState<boolean>(true);

  const onSubmit = () => {
    if (firstIdErrorMessage !== "" || secondIdErrorMessage !== "") {
      return;
    }

    if (firstId === 0) {
      setFirstIdErrorMessage("First ID is required");
      return;
    }

    // TODO: Generate faces logic
    console.log(`Generating ${firstId} faces`);
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
          <Grid container style={{ width: "25rem" }} rowSpacing={4}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" />
              <div className={clsx(contentClasses.cta, "mt-2")}>
                <Button variant="contained" color="primary" fullWidth onClick={() => { }}>
                  Pick face
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} label="Second ID" />
              <div className={clsx(contentClasses.cta, "mt-2")}>
                <Button variant="contained" color="primary" fullWidth onClick={() => { }}>
                  Pick face
                </Button>
              </div>
            </Grid>
          </Grid>
          <div className={clsx(contentClasses.cta, "mt-8")}>
            <Button variant="contained" color="primary" fullWidth onClick={onSubmit}>
              Search
            </Button>
          </div>
          <div className={clsx(contentClasses.cta, "mt-4")}>
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

export default SearchFaces;