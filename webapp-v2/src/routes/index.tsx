import { RouteObject } from "react-router-dom"

import Root from "pages/Root"
import Landing from "components/Content/Landing"

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <Landing />,
        index: true,
      },
    ],
  },
]

export default routes
