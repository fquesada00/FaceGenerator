import useAuthApi from "./api/useAuthApi"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  const { setAuth } = useAuth()
  const { refreshToken } = useAuthApi()

  const refresh = async () => {
    const newAuth = await refreshToken()
    setAuth(() => ({ accessToken: newAuth.accessToken, roles: newAuth.roles }))
  }

  return refresh
}

export default useRefreshToken
