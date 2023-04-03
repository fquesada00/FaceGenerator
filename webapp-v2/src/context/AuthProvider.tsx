import { createContext, useEffect, useMemo, useState } from 'react';
import { IApiAuth } from 'services/api/models';

export const ROLES = {
  ADMIN: 0,
  USER: 1
};

export interface AuthContextProps {
  auth: IApiAuth;
  setAuth: React.Dispatch<React.SetStateAction<IApiAuth>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [auth, setAuth] = useState<IApiAuth>({ accessToken: '', roles: [] });
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem('persist') || 'false') || false
  );
  const isAdmin = useMemo(() => auth.roles.includes(ROLES.ADMIN), [auth.roles]);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, persist, setPersist, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
