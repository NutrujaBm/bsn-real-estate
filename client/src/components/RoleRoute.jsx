// src/components/RoleRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// RoleRoute component checks for both login and role
function RoleRoute({ role }) {
  const { currentUser } = useSelector((state) => state.user);

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (role === "admin" && currentUser.role !== "admin") {
    return <Navigate to="/" />; // Redirect to home if role is not admin
  }

  if (role === "member" && currentUser.role !== "member") {
    return <Navigate to="/" />; // Redirect to home if role is not member
  }

  return <Outlet />;
}

export default RoleRoute;
