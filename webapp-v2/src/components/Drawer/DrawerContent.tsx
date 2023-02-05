import React from "react"
import HomeIcon from "@mui/icons-material/Home"
import ImportExportIcon from "@mui/icons-material/ImportExport"
import SearchIcon from "@mui/icons-material/Search"
import LayersIcon from "@mui/icons-material/Layers"
import ImageSearchIcon from "@mui/icons-material/ImageSearch"
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural"
import ShuffleIcon from "@mui/icons-material/Shuffle"
import InfoIcon from "@mui/icons-material/Info"
import paths from "routes/paths"
import DrawerButton from "./DrawerButton"
import drawerButtons from "./DrawerButtons"
const DrawerContent = () => {
  return (
    <React.Fragment>
      {drawerButtons.map(({ icon: Icon, path, text, style }, index) => (
        <DrawerButton
          key={index}
          icon={<Icon style={style} />}
          text={text}
          path={path}
        />
      ))}
    </React.Fragment>
  )
}

export default DrawerContent
