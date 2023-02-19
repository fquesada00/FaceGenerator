import useAuth from 'hooks/useAuth';
import useAuthApi from './api/useAuthApi';

const useLogout = () => {
  const { setAuth } = useAuth();
  const { logout: logoutApi } = useAuthApi();
  const logout = async () => {
    setAuth({ accessToken: '', roles: [] });
    await logoutApi();
  };
  return logout;
};

export default useLogout;
