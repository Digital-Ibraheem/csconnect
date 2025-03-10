"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  avatar: string;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  openLoginModal: (message?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const router = useRouter()

  const BACKEND_URL = "http://localhost:8080"

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      console.log("Fetching user data...");
      const response = await axios.get(BACKEND_URL + "/api/users/me", {
        headers: {Authorization: `Bearer ${token}`}
      })
      console.log("User data recieved: ", response.data);
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setUser(null);
    }
  }

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchCurrentUser(token);
    router.push("/explore");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };



  // Function to trigger login modal with an optional message
  const openLoginModal = (message?: string) => {
    setLoginMessage(message || "Please log in to continue.");
    // You would typically trigger a modal state update here
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, openLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
