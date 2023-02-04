import React from "react"
import HomeIcon from "@mui/icons-material/Home"
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import InfoIcon from '@mui/icons-material/Info';
import paths from "routes/paths";
import DrawerButton from "./DrawerButton";

const DrawerContent = () => {
  return (
    <React.Fragment>
      <DrawerButton icon={<HomeIcon />} text="Home" path={paths.home.path} />
      <DrawerButton icon={<ShuffleIcon />} text="Random faces" path={`${paths.home.path}/${paths.randomFaces.path}`} />
      <DrawerButton icon={<SearchIcon />} text="Search faces" path={`${paths.home.path}/${paths.searchFaces.path}`} />
      <DrawerButton icon={<LayersIcon />} text="Transition faces" path={`${paths.home.path}/${paths.transitionFaces.path}`} />
      <DrawerButton icon={<ImageSearchIcon />} text="Face from image" path={`${paths.home.path}/${paths.faceFromImage.path}`} />
      <DrawerButton icon={<FaceRetouchingNaturalIcon />} text="Modify face features" path={`${paths.home.path}/${paths.faceFeaturesModification.path}`} />
      <DrawerButton icon={<ImportExportIcon style={{ transform: "rotate(90deg)" }} />} text="Interchange features" path={`${paths.home.path}/${paths.interchangeFacesFeatures.path}`} />
      <DrawerButton icon={<InfoIcon />} text="About" path={paths.about.path} />
    </React.Fragment>
  )
}

export default DrawerContent;