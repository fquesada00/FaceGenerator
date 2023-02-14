import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { toastError } from "components/Toast"
import { Field, Form, Formik } from "formik"
import { initialValues, loginSchema, LoginFormValues } from "forms/login"
import useAuthApi from "hooks/api/useAuthApi"
import useAuth from "hooks/useAuth"
import { useEffect, useMemo } from "react"
import { useMutation } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import ApiError from "services/api/Error"

const Login: React.FC = () => {
  const { setAuth, auth, persist, setPersist } = useAuth()
  const { login } = useAuthApi()

  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(() => location.state?.from?.pathname || "/", [location])

  const {
    mutate: mutateLogin,
    isLoading: isLoadingLogin,
    data: loginData,
  } = useMutation(login, {
    onSuccess: (data) => {
      console.log("data", data)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        toastError(error.toString())
      }
    },
  })

  useEffect(() => {
    if (loginData) {
      setAuth(loginData)
    }
  }, [loginData])

  useEffect(() => {
    if (auth.accessToken) {
      navigate(from, { replace: true })
    }
  }, [auth])

  const onSubmit = ({ username, password }: LoginFormValues) => {
    mutateLogin({ username, password })
  }

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist))
  }, [persist])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={onSubmit}
        >
          {({ values, handleChange, touched, errors }) => (
            <Box component={Form} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                checked={persist}
                onChange={() => setPersist(!persist)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  )
}

export default Login
