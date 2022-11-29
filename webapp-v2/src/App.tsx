import { ThemeProvider } from "@emotion/react"
import { RouterProvider } from "react-router-dom"

import router from "router"
import mdTheme from "theme"

const App = () => {
  return (
    <ThemeProvider theme={mdTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
