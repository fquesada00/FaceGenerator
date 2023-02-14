import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "hooks/useAuth"
import { useEffect, useMemo } from "react"

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

  return roles.find((role) => allowedRoles?.includes(role)) !== undefined ? (
    <Outlet />
  ) : auth.accessToken ? (
    <Navigate to="/faces" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
