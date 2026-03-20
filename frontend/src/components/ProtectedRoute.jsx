import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Notice we are catching the special { children } prop here!
export default function ProtectedRoute({ children }) {
  // 1. Grab the VIP wristband from the context
  const { token } = useContext(AuthContext);

  // 2. The Bouncer Logic:
  return token ? children : <Navigate to="/login" />;
}
