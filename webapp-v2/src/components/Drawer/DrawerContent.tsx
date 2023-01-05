import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import HomeIcon from "@mui/icons-material/Home"
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import InfoIcon from '@mui/icons-material/Info';

import React from "react"
import { useNavigate } from "react-router-dom";
import paths from "routes/paths";

const DrawerContent = () => {
  const navigate = useNavigate();
  
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate(paths.home)}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`${paths.home}/${paths.randomFaces}`)}>
        <ListItemIcon>
          <EmojiEmotionsIcon />
        </ListItemIcon>
        <ListItemText primary="Random faces" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`${paths.home}/${paths.searchFaces}`)}>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Search faces" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`${paths.home}/${paths.transitionFaces}`)}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Transition faces" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`${paths.home}/${paths.faceFromImage}`)}>
        <ListItemIcon>
          <ImageSearchIcon />
        </ListItemIcon>
        <ListItemText primary="Face from image" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`${paths.home}/${paths.faceFeaturesModification}`)}>
        <ListItemIcon>
          <FaceRetouchingNaturalIcon />
        </ListItemIcon>
        <ListItemText primary="Modify face features" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(`${paths.home}/${paths.interchangeFacesFeatures}`)}>
        <ListItemIcon>
          <ShuffleIcon />
        </ListItemIcon>
        <ListItemText primary="Interchange features" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate(paths.about)}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItemButton>
    </React.Fragment>
  )
}

export default DrawerContent
