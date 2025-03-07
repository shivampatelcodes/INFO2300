/* eslint-disable no-unused-vars */
import { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUp from "./pages/Register";
import SignIn from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import DriverDashboard from "./pages/DriverDashboard";
import BookingPage from "./pages/BookingPage";
import ManageBookingsPage from "./pages/ManageBookingsPage";
import Settings from "./pages/Settings";
import ProfileCompleteRoute from "./components/ProfileCompleteRoute";
import Profile from "./pages/Profile";
// import { AuthContext } from "./main.jsx";

// const DefaultRoute = () => {
//   const user = useContext(AuthContext);
// If user exists, redirect to dashboard; otherwise to sign in.
//   return <Navigate to={user ? "/dashboard" : "/signin"} replace />;
// };

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/dashboard"
          element={
            <ProfileCompleteRoute>
              <Dashboard />
            </ProfileCompleteRoute>
          }
        />
        <Route
          path="/driver-dashboard"
          element={
            <ProfileCompleteRoute>
              <DriverDashboard />
            </ProfileCompleteRoute>
          }
        />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/manage-bookings" element={<ManageBookingsPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        {/* Redirect the default route to /dashboard so that ProfileCompleteRoute applies */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;