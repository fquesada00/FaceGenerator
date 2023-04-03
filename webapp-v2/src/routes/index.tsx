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
import FacesSeries from 'components/Content/FacesSeries';
import Settings from 'components/Content/Settings';
import { ROLES } from 'context/AuthProvider';

const routes: RouteObject[] = [
  {
    path: paths.login.path,
    element: <Login />
  },
  {
    element: <PersistentLogin />,
    children: [
      {
        element: <RequireAuth allowedRoles={[ROLES.USER, ROLES.ADMIN]} />,
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
                path: paths.facesSeries.path,
                element: <FacesSeries />
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
          },
          {
            path: paths.settings.path,
            element: <RequireAuth allowedRoles={[ROLES.ADMIN]} />,
            children: [
              {
                element: <Root />,
                children: [
                  {
                    element: <Settings />,
                    index: true
                  }
                ]
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
