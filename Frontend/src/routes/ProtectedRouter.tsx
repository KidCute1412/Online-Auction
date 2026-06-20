import { createContext, useContext, useState, useEffect } from "react";
import { profileService } from "@/services/profile.service.ts";

const AuthContext = createContext<any>(null);
export type AuthType = {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  rating: number;
  rating_count: number;
  address: string;
  date_of_birth: string;
};
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthType | null>(null);

  async function getUserData() {
    try {
      const data = await profileService.getMe();
      setUser(data.data);
    } catch (error) {
      setUser(null);
      console.error("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ auth: user, setAuth: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
