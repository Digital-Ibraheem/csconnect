"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useModal } from "@/context/ModalContext";

// Update the type declaration at the top of your file
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          disableAutoSelect: () => void;
          initialize: (config: any) => void;
          prompt: () => void;
        }
      }
    }
  }
}

interface User {
  id: number;
  avatar: string;
  fullName: string;
  email: string;
  username: string;
  authProvider: string;
  profilePictureUrl: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  openLoginModal: (message?: string) => void;
  loginMessage: string | null;
  setLoginMessage: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const router = useRouter()
  const { openModal } = useModal();

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
        headers: { Authorization: `Bearer ${token}` }
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

  const handleLocalLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const handleGoogleLogout = async () => {
    try {
      // First check if the Google API is loaded
      if (window.google && window.google.accounts && window.google.accounts.id) {
        // Sign out from Google
        window.google.accounts.id.disableAutoSelect();
      }
      
      // Then perform the same actions as local logout
      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error during Google logout:", error);
      // Fallback to local logout if Google logout fails
      handleLocalLogout();
    }
  };

  const logout = () => {
    if (user?.authProvider === "google") {
      handleGoogleLogout();
    } else {
      handleLocalLogout();
    }
  };

  // Function to trigger login modal with an optional message
  const openLoginModal = (message?: string) => {
    setLoginMessage(message || "Please log in to continue.");
    openModal('login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login, 
      logout, 
      openLoginModal,
      loginMessage,
      setLoginMessage,
      token: localStorage.getItem("token")
    }}>
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
