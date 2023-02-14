import useRefreshToken from "hooks/useRefreshToken"
import useAuth from "hooks/useAuth"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

const PersistentLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()
  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (error) {
        console.log(error)
      } finally {
        isMounted && setIsLoading(false)
      }
    }
    if (!auth?.accessToken) {
      verifyRefreshToken()
    } else {
      setIsLoading(false)
    }
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      {!persist ? <Outlet /> : isLoading ? <div>Loading...</div> : <Outlet />}
    </>
  )
}

export default PersistentLogin
