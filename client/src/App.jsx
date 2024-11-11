import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import PropertyListings from "./pages/PropertyListings";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Password from "./pages/Password";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* หน้าแรกและหน้าอื่น ๆ */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyListings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* เส้นทางที่ต้องการการยืนยันตัวตน */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/password" element={<Password />} />
          {/* <Route path="/profile/delete" element={<DeleteAccount />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
