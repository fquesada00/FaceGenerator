import { Typography, Button, Grid } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "../styles/Content.module.scss"
import IdInput from "components/Inputs/IdInput";


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

  const renderIdField = (setId: (n: number) => void, setErrorMessage: (s: string) => void, errorMessage: string, required: boolean = false, label?: string) => {
    return (
      <div className={clsx(inputsClasses.field)}>
        <IdInput
          onChange={(n) => {
            if (isNaN(n)) {
              setId(0);
              return;
            }

            setId(n);
          }}
          label={label}
          setErrorMessage={setErrorMessage} errorMessage={errorMessage} required={required}
        />
      </div>
    );
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
              {
                renderIdField(setFirstId, setFirstIdErrorMessage, firstIdErrorMessage, true, "First ID")
              }
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              {
                renderIdField(setSecondId, setSecondIdErrorMessage, secondIdErrorMessage, false, "Second ID")
              }
            </Grid>
          </Grid>
          <div className={clsx(contentClasses.cta)}>
            <Button variant="contained" color="primary" fullWidth onClick={onSubmit}>
              Search
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

export default SearchFaces;