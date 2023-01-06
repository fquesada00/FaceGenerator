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
      <DrawerButton icon={<HomeIcon />} text="Home" path={paths.home} />
      <DrawerButton icon={<ShuffleIcon />} text="Random faces" path={`${paths.home}/${paths.randomFaces}`} />
      <DrawerButton icon={<SearchIcon />} text="Search faces" path={`${paths.home}/${paths.searchFaces}`} />
      <DrawerButton icon={<LayersIcon />} text="Transition faces" path={`${paths.home}/${paths.transitionFaces}`} />
      <DrawerButton icon={<ImageSearchIcon />} text="Face from image" path={`${paths.home}/${paths.faceFromImage}`} />
      <DrawerButton icon={<FaceRetouchingNaturalIcon />} text="Modify face features" path={`${paths.home}/${paths.faceFeaturesModification}`} />
      <DrawerButton icon={<ImportExportIcon style={{ transform: "rotate(90deg)" }} />} text="Interchange features" path={`${paths.home}/${paths.interchangeFacesFeatures}`} />
      <DrawerButton icon={<InfoIcon />} text="About" path={paths.about} />
    </React.Fragment>
  )
}

export default DrawerContent;