import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const access = localStorage.getItem("access");
  const location = useLocation();
  if (!access) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return children;
}
