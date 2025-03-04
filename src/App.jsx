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
import PrivateRoute from "./components/PrivateRoute";
import ProfileCompleteRoute from "./components/ProfileCompleteRoute";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProfileCompleteRoute>
                <Dashboard />
              </ProfileCompleteRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/driver-dashboard"
          element={
            <PrivateRoute>
              <ProfileCompleteRoute>
                <DriverDashboard />
              </ProfileCompleteRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/search-results"
          element={
            <PrivateRoute>
              <SearchResults />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-bookings"
          element={
            <PrivateRoute>
              <ManageBookingsPage />
            </PrivateRoute>
          }
        />

        {/* Route for profile settings */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
