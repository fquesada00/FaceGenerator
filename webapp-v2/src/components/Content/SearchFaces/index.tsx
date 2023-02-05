import { Typography, Button, Grid } from "@mui/material";
import clsx from "clsx";
import { useMemo, useState } from "react";

import inputsClasses from "components/Inputs/styles/Inputs.module.scss";
import CustomIdInput from "components/Inputs/custom/CustomIdInput";
import CtaButton from "components/CtaButton";
import ContentHeader from "components/ContentHeader";
import paths from "routes/paths";
import { useMutation, useQuery } from "react-query";
import { toastError } from "components/Toast";
import ApiError from "services/api/Error";
import { getAllFaces, getAllTags, searchFaces } from "services/api/FaceGeneratorApi";
import useRenderImages from "hooks/useRenderImages";
import PickImageButton from "components/CtaButton/custom/PickImageButton";
import useAutocompleteChipsInput from "components/Inputs/useAutocompleteChipsInput";


const SearchFaces: React.FC = () => {
  const [hideAll, setHideAll] = useState<boolean>(true);

  const {
    mutate: mutateSearchFaces, isLoading: isLoadingSearch, data: filteredFaces
  } = useMutation(searchFaces, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });

  const { images: SearchFacesImages } = useRenderImages({ faces: filteredFaces, disableSave: true })

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

  const onShowAll = () => {
    if (hideAll) {
      mutateGetAllFaces({});
    }
    setHideAll(!hideAll);
  }

  const { isLoading: loadingTags, data: tags } = useQuery('tags', getAllTags, {
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString());
      }
    }
  });
  const { content: Autocomplete, value: selectedTags } = useAutocompleteChipsInput({
    options: tags,
    label: "Search tags",
    value: [],
  });

  const onSubmit = () => {
    mutateSearchFaces({ tags: selectedTags });
  };

  return (
    <div>
      <ContentHeader
        title={paths.searchFaces.title}
        subtitle={renderSubtitle}
      />
      <form>
        <div className={clsx(inputsClasses.container)}>
          <div className="flex justify-center">
            <div className="w-11/12">
              {Autocomplete}
            </div>
          </div>
          <CtaButton onClick={onSubmit} label="Search" className="mt-8" loading={isLoadingSearch} />
          {
            !isLoadingSearch && filteredFaces && SearchFacesImages
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