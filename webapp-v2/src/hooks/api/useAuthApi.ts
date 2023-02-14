import { useMemo } from "react"
import qs from "qs"
import useAxios from "hooks/useAxios"
import apiProvider, { AUTH_API_PREFIX } from "services/api"
import ApiError, { getErrorMessage } from "services/api/Error"
import { ApiResponse, IApiAuth } from "services/api/models"

const useAuthApi = () => {
  const client = useAxios()

  const api = useMemo(() => apiProvider(client), [client])

  const login = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<IApiAuth> => {
    try {
      const response = await api.post<ApiResponse>(`${AUTH_API_PREFIX}/token`, {
        body: qs.stringify({ username, password }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      return response.result
    } catch (error) {
      throw new ApiError("Authentication error", getErrorMessage(error))
    }
  }

  const logout = async (): Promise<IApiAuth> => {
    try {
      const response = await api.post<ApiResponse>(
        `${AUTH_API_PREFIX}/logout`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      return response.result
    } catch (error) {
      throw new ApiError("Authentication error", getErrorMessage(error))
    }
  }

  const refreshToken = async (): Promise<IApiAuth> => {
    try {
      const response = await api.get<ApiResponse>(
        `${AUTH_API_PREFIX}/refresh-token`,
        {
          withCredentials: true,
        }
      )
      return response.result
    } catch (error) {
      throw new ApiError("Refresh token error", getErrorMessage(error))
    }
  }
  return { login, logout, refreshToken }
}

export default useAuthApi
