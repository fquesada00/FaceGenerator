import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "hooks/useAuth"
import { useCallback, useEffect, useMemo } from "react"

interface RequireAuthProps {
  allowedRoles?: number[]
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  allowedRoles,
}: RequireAuthProps) => {
  const { auth } = useAuth()
  const location = useLocation()

  const roles = useMemo(() => {
    return auth.roles
  }, [])

  const ComponentOrNavigate = useCallback(() => {
    const isRoleAllowed = roles.find((role) => allowedRoles?.includes(role))

    if (isRoleAllowed) {
      return <Outlet />
    }

    if (auth.accessToken) {
      return <Navigate to="/faces" state={{ from: location }} replace />
    }

    return <Navigate to="/login" state={{ from: location }} replace />
  }, [roles, allowedRoles, auth, location])

  return <ComponentOrNavigate />
}

export default RequireAuth
