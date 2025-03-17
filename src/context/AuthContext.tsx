
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    
    if (storedLoggedIn === "true" && storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
      setUserName(storedName);
    }
  }, []);

  const login = (email: string, name?: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    if (name) setUserName(name);
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
