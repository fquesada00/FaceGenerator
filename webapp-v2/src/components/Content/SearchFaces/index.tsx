import { Typography, Button, Grid } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";
import CtaButton from "components/CtaButton";
import ContentHeader from "components/ContentHeader";
import paths from "routes/paths";
import { useMutation } from "react-query";
import { toastError } from "components/Toast";
import ApiError from "services/api/Error";
import { getAllFaces, searchFacesBetweenIds } from "services/api/FaceGeneratorApi";
import useRenderImages from "hooks/useRenderImages";


const SearchFaces: React.FC = () => {
  const [firstId, setFirstId] = useState<number>(0);
  const [firstIdErrorMessage, setFirstIdErrorMessage] = useState<string>("");

  const [secondId, setSecondId] = useState<number>(0);
  const [secondIdErrorMessage, setSecondIdErrorMessage] = useState<string>("");

  const [hideAll, setHideAll] = useState<boolean>(true);

  const {
    mutate: mutateSearchFacesBetweenIds, isLoading: isLoadingSearch, data: searchFaces
  } = useMutation(searchFacesBetweenIds, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { images: SearchFacesImages} = useRenderImages({ faces: searchFaces, disableSave: true})

  const {
    mutate: mutateGetAllFaces, isLoading: isLoadingShowAll, data: allFaces
  } = useMutation(getAllFaces, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { images: AllFacesImages} = useRenderImages({ faces: allFaces, disableSave: true })

  
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
    let hasError = false;
    if (firstIdErrorMessage !== "" || secondIdErrorMessage !== "") {
      return;
    }

    if (firstId === 0) {
      setFirstIdErrorMessage("First ID is required");
      hasError = true;
    }

    if (secondId === 0) {
      setSecondIdErrorMessage("Second ID is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    mutateSearchFacesBetweenIds({ fromId: firstId, toId: secondId });
  }

  const onShowAll = () => {
    if (hideAll) {
      mutateGetAllFaces();
    }
    setHideAll(!hideAll);
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
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} required label="Second ID" />
              <CtaButton onSubmit={onSubmit} label="Pick face" className="mt-2" />
            </Grid>
          </Grid>
          <CtaButton onSubmit={onSubmit} label="Search" className="mt-8"  loading={isLoadingSearch} />
          {
            !isLoadingSearch && searchFaces && SearchFacesImages
          }
          <CtaButton onSubmit={onShowAll} label={`${!hideAll ? "Hide" : "Show"} all`} className="mt-4" loading={isLoadingShowAll} />
          {
            !hideAll && !isLoadingShowAll && AllFacesImages
          }
        </div>
      </form>
    </div>
  );
}

export default SearchFaces;