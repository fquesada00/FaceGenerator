import { Navigate, RouteObject } from "react-router-dom"

import Root from "pages/Root"
import Home from "components/Content/Home"
import paths from "./paths"
import SearchFaces from "components/Content/SearchFaces"
import About from "components/Content/About"
import RandomFaces from "components/Content/RandomFaces"
import FaceFeaturesModification from "components/Content/FaceFeaturesModification"
import FaceFromImage from "components/Content/FaceFromImage"
import InterchangeFacesFeatures from "components/Content/InterchangeFacesFeatures"
import TransitionFaces from "components/Content/TransitionFaces"

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
        element: <Home />,
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
    element: <Navigate to={paths.home} replace/>,
  }
]

export default routes
