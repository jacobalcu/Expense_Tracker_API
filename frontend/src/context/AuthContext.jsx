import { createContext, useState } from "react";

// Create context (radio tower)
export const AuthContext = createContext();

// Create Provider Component (building that houses tower)
export function AuthProvider({ children }) {
  // Init the state
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Create login func
  const login = (newToken) => {
    // 2 Things happen when user logs in
    // Update React state
    // Save to browsers localStorage using localStorage.setItem()
    setToken(newToken);
    // Local Storage stores as key-value pairs
    localStorage.setItem("token", newToken);
  };

  // Create logout func
  const logout = () => {
    // How to reverse login process
    // Clear React State
    setToken(null);
    // Remove from localStorage using localStorage.removeItem()
    localStorage.removeItem("token");
  };

  // Broadcast values to the rest of the app
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
