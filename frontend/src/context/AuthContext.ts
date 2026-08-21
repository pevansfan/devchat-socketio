import { createContext } from "react";

import type { CurrentUserResponse } from "@/types/current-user-response";

export interface AuthContextType {
  user: CurrentUserResponse | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);