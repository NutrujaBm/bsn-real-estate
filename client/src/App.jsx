import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import PropertyListings from "./pages/PropertyListings";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Password from "./pages/Password";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import ShowListing from "./pages/ShowListing";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import PropertyManagement from "./pages/PropertyManagement";
import Search from "./pages/Search";
import PrivateRoute from "./components/PrivateRoute"; // For authentication
import LineContact from "./components/LineContact";
import LatLngFinder from "./pages/LatLngFinder";
import UserReportForm from "./pages/UserReportForm";
import AdminReportList from "./pages/AdminReportList";
import UserGalleryPage from "./pages/UserGalleryPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/listing/:listingId" element={<PropertyListings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/latLngFinder" element={<LatLngFinder />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {/* Accessible by both admin and member */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/password" element={<Password />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route path="/show-listing" element={<ShowListing />} />
          <Route path="/user-gallery/:userId" element={<UserGalleryPage />} />
          <Route path="/report-form" element={<UserReportForm />} />
        </Route>

        {/* Admin-only Routes */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/properties" element={<PropertyManagement />} />
          <Route path="/admin/report" element={<AdminReportList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
