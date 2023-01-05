import { RouteObject } from "react-router-dom"

import Root from "pages/Root"
import Landing from "components/Content/Landing"
import RandomFaces from "pages/RandomFaces"
import paths from "./paths"
import SearchFaces from "pages/SearchFaces"
import TransitionFaces from "pages/TransitionFaces"
import FaceFromImage from "pages/FaceFromImage"
import FaceFeaturesModification from "pages/FaceFeaturesModification"
import InterchangeFacesFeatures from "pages/InterchangeFacesFeatures"
import About from "pages/About"

const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <Root />,
    children: [
      {
        path: paths.randomFaces,
        element: <RandomFaces />,
      },
      {
        path: paths.searchFaces,
        element: <SearchFaces />,
      },
      {
        path: paths.transitionFaces,
        element: <TransitionFaces />,
      },
      {
        path: paths.faceFromImage,
        element: <FaceFromImage />,
      },
      {
        path: paths.faceFeaturesModification,
        element: <FaceFeaturesModification />,
      },
      {
        path: paths.interchangeFacesFeatures,
        element: <InterchangeFacesFeatures />,
      },
      {
        element: <Landing />,
        index: true,
      },
    ],
  },
  {
    path: paths.about,
    element: <Root />,
    children: [
      {
        element: <About />,
        index: true,
      },
    ],
  },
  {
    path: "*",
    element: <Root />,
    children: [
      {
        element: <Landing />,
        index: true,
      },
    ],
  }
]

export default routes
