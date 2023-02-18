import { Navigate, RouteObject } from 'react-router-dom';

import Root from 'pages/Root';
import Home from 'components/Content/Home';
import SearchFaces from 'components/Content/SearchFaces';
import About from 'components/Content/About';
import RandomFaces from 'components/Content/RandomFaces';
import FaceFeaturesModification from 'components/Content/FaceFeaturesModification';
import FaceFromImage from 'components/Content/FaceFromImage';
import InterchangeFacesFeatures from 'components/Content/InterchangeFacesFeatures';
import TransitionFaces from 'components/Content/TransitionFaces';
import Login from 'pages/Login';
import RequireAuth from 'components/RequireAuth';
import PersistentLogin from 'components/PersistentLogin';
import paths from './paths';

const ROLES = {
  USER: 0,
  ADMIN: 1
};

const routes: RouteObject[] = [
  {
    path: paths.login.path,
    element: <Login />
  },
  {
    element: <PersistentLogin />,
    children: [
      {
        element: <RequireAuth allowedRoles={[ROLES.USER]} />,
        children: [
          {
            path: paths.home.path,
            element: <Root />,
            children: [
              {
                path: paths.randomFaces.path,
                element: <RandomFaces />
              },
              {
                path: paths.searchFaces.path,
                element: <SearchFaces />
              },
              {
                path: paths.transitionFaces.path,
                element: <TransitionFaces />
              },
              {
                path: paths.faceFromImage.path,
                element: <FaceFromImage />
              },
              {
                path: paths.faceFeaturesModification.path,
                element: <FaceFeaturesModification />
              },
              {
                path: paths.interchangeFacesFeatures.path,
                element: <InterchangeFacesFeatures />
              },
              {
                element: <Home />,
                index: true
              }
            ]
          },
          {
            path: paths.about.path,
            element: <Root />,
            children: [
              {
                element: <About />,
                index: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to={paths.home.path} replace />
  }
];

export default routes;
