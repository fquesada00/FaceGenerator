import useRefreshToken from 'hooks/useRefreshToken';
import useAuth from 'hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

function PersistentLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const ComponentOrLoading = useCallback(() => {
    if (!persist) {
      return <Outlet />;
    }
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Outlet />;
  }, [persist, isLoading]);

  return <ComponentOrLoading />;
}

export default PersistentLogin;
