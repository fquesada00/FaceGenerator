import { Typography, Button, Grid } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import contentClasses from "../styles/Content.module.scss"
import CustomIdInput from "components/Inputs/custom/CustomIdInput";
import CtaButton from "components/CtaButton";
import ContentHeader from "components/ContentHeader";
import paths from "routes/paths";


const SearchFaces: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const [hideAll, setHideAll] = useState<boolean>(true);

  const renderSubtitle = useMemo(() => {
    return (
      <div>
        Lookup for the faces that you want to see.
        <br />
        The results will be displayed below.
      </div>
    )
  }, [])

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
      <ContentHeader
        title={paths.searchFaces.title}
        subtitle={renderSubtitle}
      />
      <form>
        <div className={clsx(inputsClasses.container)}>
          <Grid container style={{ width: "25rem" }} rowSpacing={4}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" />
              <CtaButton onSubmit={onSubmit} label="Pick face" className="mt-2" />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} label="Second ID" />
              <CtaButton onSubmit={onSubmit} label="Pick face" className="mt-2" />

            </Grid>
          </Grid>
          <CtaButton onSubmit={onSubmit} label="Search" className="mt-8" />
          <CtaButton onSubmit={() => setHideAll(!hideAll)} label={`${!hideAll ? "Hide" : "Show"} all`} className="mt-4" />
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