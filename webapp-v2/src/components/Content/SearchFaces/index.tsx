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
import PickImageButton from "components/CtaButton/custom/PickImageButton";


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

  const { images: SearchFacesImages } = useRenderImages({ faces: searchFaces, disableSave: true })

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

  const { images: AllFacesImages } = useRenderImages({ faces: allFaces, disableSave: true })


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
    if ((firstIdErrorMessage !== "" && firstId <= 0) || (secondIdErrorMessage !== "" && secondId <= 0)) {
      return;
    }

    let hasError = false;

    if (firstId === 0) {
      setFirstIdErrorMessage("First ID is required");
      hasError = true;
    } else {
      setFirstIdErrorMessage("");
    }

    if (secondId === 0) {
      setSecondIdErrorMessage("Second ID is required");
      hasError = true;
    } else {
      setSecondIdErrorMessage("");
    }

    if (hasError) {
      return;
    }

    setFirstIdErrorMessage("");
    setSecondIdErrorMessage("");

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
              <CustomIdInput setId={setFirstId} setErrorMessage={setFirstIdErrorMessage} errorMessage={firstIdErrorMessage} required label="First ID" id={firstId} />
              <PickImageButton onDone={(faceId) => setFirstId(faceId ?? 0)} pickedFaceId={firstId} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomIdInput setId={setSecondId} setErrorMessage={setSecondIdErrorMessage} errorMessage={secondIdErrorMessage} required label="Second ID" id={secondId} />
              <PickImageButton onDone={(faceId) => setSecondId(faceId ?? 0)} pickedFaceId={secondId} />
            </Grid>
          </Grid>
          <CtaButton onClick={onSubmit} label="Search" className="mt-8" loading={isLoadingSearch} />
          {
            !isLoadingSearch && searchFaces && SearchFacesImages
          }
          <CtaButton onClick={onShowAll} label={`${!hideAll ? "Hide" : "Show"} all`} className="mt-4" loading={isLoadingShowAll} />
          {
            !hideAll && !isLoadingShowAll && AllFacesImages
          }
        </div>
      </form>
    </div>
  );
}

export default SearchFaces;