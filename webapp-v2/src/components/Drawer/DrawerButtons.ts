import HomeIcon from '@mui/icons-material/Home';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import paths from 'routes/paths';

const buttons = [
  {
    icon: HomeIcon,
    text: paths.home.title,
    path: paths.home.path,
  },
  {
    icon: ShuffleIcon,
    text: paths.randomFaces.title,
    path: `${paths.home.path}/${paths.randomFaces.path}`,
  },
  {
    icon: SearchIcon,
    text: paths.searchFaces.title,
    path: `${paths.home.path}/${paths.searchFaces.path}`,
  },
  {
    icon: LayersIcon,
    text: paths.transitionFaces.title,
    path: `${paths.home.path}/${paths.transitionFaces.path}`,
  },
  {
    icon: ImageSearchIcon,
    text: paths.faceFromImage.title,
    path: `${paths.home.path}/${paths.faceFromImage.path}`,
  },
  {
    icon: FaceRetouchingNaturalIcon,
    text: paths.faceFeaturesModification.title,
    path: `${paths.home.path}/${paths.faceFeaturesModification.path}`,
  },
  {
    icon: ImportExportIcon,
    text: paths.interchangeFacesFeatures.title,
    style: { transform: "rotate(90deg)" },
    path: `${paths.home.path}/${paths.interchangeFacesFeatures.path}`,
  },
  {
    icon: GroupIcon,
    text: paths.facesSeries.title,
    path: `${paths.home.path}/${paths.facesSeries.path}`,
  },
  {
    icon: InfoIcon,
    text: paths.about.title,
    path: paths.about.path
  }
];

export default buttons;
