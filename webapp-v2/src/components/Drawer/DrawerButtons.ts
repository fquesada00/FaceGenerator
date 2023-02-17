import HomeIcon from '@mui/icons-material/Home';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import InfoIcon from '@mui/icons-material/Info';
import paths from 'routes/paths';

const buttons = [
  {
    icon: HomeIcon,
    text: 'Home',
    path: paths.home.path
  },
  {
    icon: ShuffleIcon,
    text: 'Random faces',
    path: `${paths.home.path}/${paths.randomFaces.path}`
  },
  {
    icon: SearchIcon,
    text: 'Search faces',
    path: `${paths.home.path}/${paths.searchFaces.path}`
  },
  {
    icon: LayersIcon,
    text: 'Transition faces',
    path: `${paths.home.path}/${paths.transitionFaces.path}`
  },
  {
    icon: ImageSearchIcon,
    text: 'Face from image',
    path: `${paths.home.path}/${paths.faceFromImage.path}`
  },
  {
    icon: FaceRetouchingNaturalIcon,
    text: 'Modify face features',
    path: `${paths.home.path}/${paths.faceFeaturesModification.path}`
  },
  {
    icon: ImportExportIcon,
    text: 'Interchange features',
    style: { transform: 'rotate(90deg)' },
    path: `${paths.home.path}/${paths.interchangeFacesFeatures.path}`
  },
  {
    icon: InfoIcon,
    text: 'About',
    path: paths.about.path
  }
];

export default buttons;
