// src/components/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import RoleRoute from "./RoleRoute";

// PrivateRoute component checks for login first, then RoleRoute checks for role
function PrivateRoute({ role }) {
  const { currentUser } = useSelector((state) => state.user);

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, pass the role to RoleRoute to check the role
  return <RoleRoute role={role} />;
}

export default PrivateRoute;
