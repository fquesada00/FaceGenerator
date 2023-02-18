import { createContext, useEffect, useState } from 'react';
import { IApiAuth } from 'services/api/models';

export interface AuthContextProps {
  auth: IApiAuth;
  setAuth: React.Dispatch<React.SetStateAction<IApiAuth>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [auth, setAuth] = useState<IApiAuth>({ accessToken: '', roles: [] });
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist') || '{}') || false
  );
  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
