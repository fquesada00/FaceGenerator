import { ThemeProvider } from "@mui/material/styles"
import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import router from "router"
import mdTheme from "theme"
import AuthProvider from "context/AuthProvider"

const queryClient = new QueryClient()

const App = () => {
  return (
    <ThemeProvider theme={mdTheme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
