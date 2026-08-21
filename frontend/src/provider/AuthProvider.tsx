import { useEffect, useState, type ReactNode } from "react";

import { getCurrentUser } from "@/lib/api-auth";
import { AuthContext } from "@/context/AuthContext";
import type { CurrentUserResponse } from "@/types/current-user-response";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      await refreshUser();
      setLoading(false);
    };

    loadUser();
  }, []);
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
